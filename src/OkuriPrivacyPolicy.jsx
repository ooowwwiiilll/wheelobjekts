import React from 'react';
import './css/privacy.css'; // importing CSS to handle the max-width media query

export default function OkuriPrivacyPolicy() {
    return (
        <div className="privacy-container">
            <div className="privacy-content">
                <h1>Privacy Policy</h1>
                <p>Last updated: 7 August 2026</p>

                <p>
                    OKURI is designed to work without an account. We do not operate user accounts, we do not run analytics or advertising SDKs, and we do not build profiles of you. Almost everything the app reads stays on your device.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                    We do not collect, store, or share personally identifiable information (PII) on our servers. OKURI has no login, no user database, and no third-party analytics, advertising, or tracking software.
                </p>
                <p>
                    With your explicit permission, the app reads certain data from your device in order to render your day sheet, Day Recap, and widgets. That data is processed on your device and written only to OKURI's own private storage (an App Group container shared with its widgets). It is not uploaded to us.
                </p>

                <h2>2. Health &amp; Fitness Data</h2>
                <p>
                    If you enable the Health Journal, OKURI requests <strong>read-only</strong> access to Apple Health (HealthKit). It never writes to, modifies, or deletes anything in Health.
                </p>
                <p>With your permission, we read only:</p>
                <p>• Workouts</p>
                <p>• Walking + Running Distance</p>
                <p>• Active Energy Burned</p>
                <p>• Sleep Analysis</p>
                <p>
                    This information is used for one purpose only: to display your activity and rest on your calendar sheet, in Day Recap, and in OKURI's home screen widgets.
                </p>
                <p>
                    Health data never leaves your device. We do not transmit it to our servers or to any third party. We do not use it for advertising, marketing, or data mining, and we do not sell it, rent it, or share it with anyone, including data brokers and advertising platforms. It is not used for any purpose other than your own health and fitness presentation inside the app.
                </p>
                <p>
                    Health data read by OKURI is stored only in the app's private on-device container so the widgets can render it. You can revoke access at any time in iOS Settings → Health → Data Access &amp; Devices → OKURI, or Settings → Privacy &amp; Security → Health. Deleting OKURI removes everything it stored locally.
                </p>

                <h2>3. Calendar &amp; Reminders</h2>
                <p>
                    With your permission, OKURI reads your calendar events so they can appear on the day sheet, and reads/writes Apple Reminders so your to-do list stays in sync across your devices via your own iCloud account. This data is handled on your device. We never copy it to our servers.
                </p>

                <h2>4. Location</h2>
                <p>
                    If you grant "While Using the App" location access, your coordinates are used solely to calculate local sunrise and sunset times. The calculation runs entirely on your device. Your location is never transmitted to us or to anyone else, and it is not stored.
                </p>

                <h2>5. Strava (Optional)</h2>
                <p>
                    OKURI can optionally connect to Strava. This is entirely opt-in and off by default. If you choose to connect, you authorise the app through Strava's own login screen; we never see or handle your Strava password.
                </p>
                <p>
                    Once connected, the app requests your recent activities (activity name, distance, moving time, and start date) directly from Strava's API in order to display your runs. Your Strava access tokens are stored in the iOS Keychain on your device. Disconnecting Strava in OKURI's settings deletes those tokens immediately.
                </p>
                <p>
                    Your use of Strava is governed by Strava's own privacy policy and terms. We are not responsible for how Strava processes your data.
                </p>

                <h2>6. Horoscope Content</h2>
                <p>
                    To display daily horoscope text, the app requests content through our relay at okuri-horoscope-proxy.vercel.app, which forwards the request to a third-party horoscope content provider. The only thing sent is your selected zodiac sign (one of twelve fixed words). No name, no account, no device identifier, no health data, and no location is included in that request. We do not log or retain these requests to identify users.
                </p>

                <h2>7. Purchases</h2>
                <p>
                    Any purchases or subscriptions are processed entirely by Apple through the App Store. We never receive or store your payment details. Apple's own privacy policy governs that transaction.
                </p>

                <h2>8. Data Retention &amp; Deletion</h2>
                <p>
                    Because we hold no personal data on our servers, there is nothing for us to retain or delete on your behalf. All data OKURI uses lives on your device. Deleting the app permanently removes it. You can also revoke Health, Calendar, Reminders, or Location access individually at any time in iOS Settings.
                </p>

                <h2>9. Children</h2>
                <p>
                    OKURI is not directed at children under 13, and we do not knowingly collect any information from them.
                </p>

                <h2>10. Changes to This Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the date above.
                </p>

                <h2>11. Contact Us</h2>
                <p>
                    If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at: speedbolt1004@gmail.com
                </p>
            </div>
        </div>
    );
}
