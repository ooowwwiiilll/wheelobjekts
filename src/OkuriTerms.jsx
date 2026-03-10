import React from 'react';
import './css/privacy.css'; // reusing CSS from the privacy policy for identical styling

export default function OkuriTerms() {
    return (
        <div className="privacy-container">
            <div className="privacy-content">
                <h1>Terms of Use</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By downloading or using our application, these terms will automatically apply to you. You should make sure therefore that you read them carefully before using the app. You are not allowed to copy or modify the app, any part of the app, or our trademarks in any way.
                </p>

                <h2>2. Use of the App</h2>
                <p>
                    We are committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you are paying for.
                </p>

                <h2>3. User Responsibilities</h2>
                <p>
                    You are responsible for keeping your phone and access to the app secure. We therefore recommend that you do not jailbreak or root your phone, which is the process of removing software restrictions and limitations imposed by the official operating system of your device.
                </p>

                <h2>4. Changes to These Terms</h2>
                <p>
                    We may update our Terms of Use from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Terms of Use on this page.
                </p>

                <h2>5. Contact Us</h2>
                <p>
                    If you have any questions or suggestions about our Terms of Use, do not hesitate to contact us at: speedbolt1004@gmail.com
                </p>
            </div>
        </div>
    );
}
