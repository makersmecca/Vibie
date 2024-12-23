import { Link } from "react-router-dom";
const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col w-full h-screen md:items-center">
      <div className="w-full font-Pacifico px-10 py-5 text-3xl bg-gray-200 flex justify-between items-center">
        <Link to="/">Vibie</Link>
        <div className="text-xl">#join the vibetribe</div>
      </div>
      <div className="mt-5 md:mt-[100px] px-5 font-Lexend">
        <div className="sticky top-0 bg-white w-full py-3 border-b-2">
          <div className="text-xl md:text-3xl">Privacy Policy</div>
          <div className="text-xs font-light mt-2">
            Last Updated Date: December 20, 2024
          </div>
        </div>
        <div className="mt-5">
          At Vibie, your privacy is our priority.
          <br /> This Privacy Policy explains how we collect, use, and protect
          your information when you use our social media platform.
          <br /> By using Vibie, you agree to the terms outlined in this policy.
        </div>
        <div className="">
          <ol className="list-decimal px-5 py-8">
            <li className="">
              <div className="text-lg">Information We Collect</div>
              <ul className="list-disc px-4">
                <li>
                  <div className="">Account Information</div>
                  When you create an account on Vibie, we collect:
                  <ul className="list-disc px-5">
                    <li>
                      Email Address: Used for account creation, login, and
                      communication.
                    </li>
                    <li>
                      Username and Profile Picture: Shared publicly on your
                      profile.
                    </li>
                  </ul>
                </li>

                <li>
                  <div className="">Content You Post</div>
                  We store the media (photos/videos) and captions you upload,
                  along with:
                  <ul className="list-disc px-5">
                    <li>Timestamps of when the content was created.</li>
                    <li>Engagement data (e.g., likes on your posts).</li>
                  </ul>
                </li>

                <li>
                  <div className="">Usage Data</div>
                  We automatically collect:
                  <ul className="list-disc px-5">
                    <li>
                      Device Information: Browser type, operating system, and
                      device type.
                    </li>
                    <li>
                      Interaction Data: Time spent on the app, actions performed
                      (e.g. likes).
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="mt-5">
              <div className="text-lg">How We Use Your Information</div>
              We use your data to:
              <ul className="list-disc px-5">
                <li>
                  Provide core features, like uploading posts and viewing the
                  global feed.
                </li>
                <li>Improve and personalize your experience on Vibie.</li>
                <li>
                  Send notifications, updates, or important communications.
                </li>
                <li>Monitor and improve app performance and security.</li>
              </ul>
            </li>
            <li className="mt-5">
              <div className="text-lg">Sharing Your Information</div>
              We do not sell or share your data with third parties, except in
              the following cases:
              <ul className="list-disc px-5">
                <li>
                  Public Content: Posts, User Profiles, Captions, and engagement
                  data (e.g., likes) are visible to all Vibie users and
                  non-users.
                </li>
                <li>
                  Service Providers: We share data with trusted services (e.g.,
                  Firebase, Appwrite) for hosting, analytics, and storage
                  purposes.
                </li>
                <li>
                  Legal Compliance: If required by law, we may disclose
                  information to comply with legal obligations.
                </li>
              </ul>
            </li>
            <li className="mt-5">
              <div className="text-lg">Data Storage and Security</div>
              <div className="px-3">
                We store your data using Firebase Firestore and Appwrite. <br />
                These services comply with industry-standard security measures
                to protect your data. <br />
                Although we take extensive measures to protect your information,
                no system is 100% secure. <br />
                We recommend safeguarding your account credentials.
              </div>
            </li>
            <li className="mt-5">
              <div className="text-lg">Your Privacy Rights</div>
              You have the right to:
              <ul className="list-disc px-5">
                <li>
                  Access Your Data: View or download the information associated
                  with your account.
                </li>
                <li>
                  Delete Your Account: Contact us to delete your account and all
                  associated data.
                </li>
                <li>Update Information: Modify your profile details.</li>
                For assistance, contact us{" "}
                <a
                  href="mailto:thisisayudh@gmail.com"
                  className="underline cursor-pointer"
                >
                  here
                </a>{" "}
                .
              </ul>
            </li>
            <li className="mt-5">
              <div className="text-lg">Children's Privacy</div>
              <div className="px-3">
                Vibie is not intended for individuals under the age of 13. We do
                not knowingly collect data from children. <br /> If you believe
                a child under 13 is using Vibie, contact us{" "}
                <a
                  href="mailto:thisisayudh@gmail.com"
                  className="underline cursor-pointer"
                >
                  here
                </a>{" "}
                .
              </div>
            </li>
            <li className="mt-5">
              <div className="text-lg">Changes to This Policy</div>
              <div className="px-3">
                We may update this policy from time to time. Please visit this
                page regularly to stay updated with our policy before continuing
                to use Vibie.
              </div>
            </li>
            <li className="mt-5">
              <div className="text-lg">Contact Us</div>
              <div className="px-3">
                If you have any questions or concerns about this policy, contact
                us at:{" "}
                <a
                  href="mailto:thisisayudh@gmail.com"
                  className="underline cursor-pointer"
                >
                  Vibie Support
                </a>{" "}
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
