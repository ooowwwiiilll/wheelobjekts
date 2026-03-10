import React from 'react';
import './css/privacy.css'; // importing CSS to handle the max-width media query

export default function OkuriPrivacyPolicy() {
    return (
        <div className="privacy-container">
            <div className="privacy-content">
                <h1>Privacy Policy</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Information We Collect</h2>
                <p>
                    We do not collect, store, or share any personal information. Our application is designed to function without requiring you to provide any personally identifiable information (PII).
                </p>

                <h2>2. Data Usage</h2>
                <p>
                    Since we do not collect any personal data, we do not use, sell, or rent your information to third parties. Any data generated while using the app remains on your device.
                </p>

                <h2>3. Third-Party Services</h2>
                <p>
                    Our application does not integrate with third-party analytics or data collection services that track your usage or personal information.
                </p>

                <h2>4. Changes to This Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>

                <h2>5. Contact Us</h2>
                <p>
                    If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at: speedbolt1004@gmail.com
                </p>
            </div>
        </div>
    );
}
