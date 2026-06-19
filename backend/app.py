from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re

app = Flask(__name__)
CORS(app)

model = joblib.load("spam_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")


def detect_links(text):
    pattern = r"(https?://\S+|www\.\S+)"
    return re.findall(pattern, text)


def detect_emails(text):
    pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    return re.findall(pattern, text)


def calculate_risk_score(text):

    score = 0

    suspicious_words = [
        "urgent",
        "winner",
        "free",
        "cash",
        "prize",
        "claim",
        "click",
        "offer",
        "limited",
        "verify",
        "password",
        "bank",
        "account",
        "lottery"
    ]

    safe_providers = [
        "gmail.com",
        "outlook.com",
        "hotmail.com",
        "yahoo.com",
        "icloud.com"
    ]

    suspicious_tlds = [
        ".xyz",
        ".top",
        ".ru",
        ".click",
        ".zip",
        ".loan"
    ]

    text_lower = text.lower()

    # Suspicious keywords
    for word in suspicious_words:
        if word in text_lower:
            score += 5

    # Links
    links = detect_links(text)

    score += len(links) * 15

    for link in links:
        if any(
            shortener in link.lower()
            for shortener in [
                "bit.ly",
                "tinyurl",
                "goo.gl",
                "t.co"
            ]
        ):
            score += 20

    # Emails
    emails = detect_emails(text)

    for email in emails:

        email_lower = email.lower()
        domain = email_lower.split("@")[1]

        # suspicious words in email
        if any(
            word in email_lower
            for word in [
                "verify",
                "security",
                "login",
                "winner",
                "reward",
                "claim",
                "bank"
            ]
        ):
            score += 15

        # suspicious domain extensions
        if any(
            domain.endswith(tld)
            for tld in suspicious_tlds
        ):
            score += 20

        # phishing style domains
        if "-" in domain:
            score += 10

        # unknown domains
        if domain not in safe_providers:
            score += 3

    return min(score, 100)


@app.route("/")
def home():
    return "SpamShield API Running"


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    message = data["message"]

    transformed = vectorizer.transform([message])

    prediction = model.predict(transformed)[0]

    probabilities = model.predict_proba(transformed)[0]

    not_spam_probability = float(probabilities[0])
    spam_probability = float(probabilities[1])

    links = detect_links(message)
    emails = detect_emails(message)

    risk_score = calculate_risk_score(message)

    threat_score = min(
        100,
        round(
            spam_probability * 0.7 * 100 +
            risk_score * 0.3,
            2
        )
    )

    confidence = (
        spam_probability * 100
        if prediction == 1
        else not_spam_probability * 100
    )

    indicators = []

    # Link indicators
    if len(links) > 0:
        indicators.append("Suspicious Link Detected")

    for link in links:
        if any(
            shortener in link.lower()
            for shortener in [
                "bit.ly",
                "tinyurl",
                "goo.gl",
                "t.co"
            ]
        ):
            indicators.append("URL Shortener Found")

    # Email indicators
    suspicious_tlds = [
        ".xyz",
        ".top",
        ".ru",
        ".click",
        ".zip",
        ".loan"
    ]

    for email in emails:

        email_lower = email.lower()
        domain = email_lower.split("@")[1]

        if any(
            word in email_lower
            for word in [
                "verify",
                "security",
                "login",
                "winner",
                "reward",
                "claim",
                "bank"
            ]
        ):
            indicators.append(
                f"Suspicious Email: {email}"
            )

        if any(
            domain.endswith(tld)
            for tld in suspicious_tlds
        ):
            indicators.append(
                f"Suspicious Domain: {domain}"
            )

        if "-" in domain:
            indicators.append(
                f"Phishing-style Domain: {domain}"
            )

    # Message indicators
    if "urgent" in message.lower():
        indicators.append(
            "Urgency Language Detected"
        )

    if "free" in message.lower():
        indicators.append(
            "Reward/Bait Language Detected"
        )

    if any(
        word in message.lower()
        for word in [
            "verify",
            "password",
            "login",
            "account"
        ]
    ):
        indicators.append(
            "Credential Phishing Keywords Found"
        )

    # Recommendation
    if threat_score > 50:
        recommendation = [
            "Do not click any links in this message.",
            "Verify the sender through official channels.",
            "Never share passwords, OTPs, or banking details.",
            "Report this message as phishing/spam."
        ]
    else:
        recommendation = [
            "No significant threats detected."
        ]

    return jsonify({
        "prediction":
            "Spam" if prediction == 1 else "Not Spam",

        "confidence":
            round(confidence, 2),

        "threat_score":
            threat_score,

        "links_found":
            len(links),

        "emails_found":
            len(emails),

        "risk_score":
            risk_score,

        "detected_links":
            links,

        "detected_emails":
            emails,

        "indicators":
            indicators,

        "recommendation":
            recommendation,

        "spam_probability":
            round(spam_probability * 100, 2),

        "not_spam_probability":
            round(not_spam_probability * 100, 2)
    })


if __name__ == "__main__":
    app.run(debug=True)