import { Link } from "react-router-dom";
const TermsOfUse = () => {
  return (
    <div className="flex flex-col w-full h-screen md:items-center">
      <div className="w-full font-Pacifico px-10 py-5 text-3xl bg-gray-200 flex justify-between items-center">
        <Link to="/">Vibie</Link>
        <div className="text-xl">#join the vibetribe</div>
      </div>
      <div className="mt-5 md:mt-[100px] px-5 font-Lexend md:max-w-[80%] w-full">
        <div className="sticky top-0 bg-white w-full py-3 border-b-2">
          <div className="text-xl md:text-3xl">Terms of Use</div>
          <div className="text-xs font-light mt-2">
            Last Updated Date: December 20, 2024
          </div>
        </div>
        <div className="mt-5">
          Welcome to Vibie! <br />
          By using our platform, you agree to comply with these Terms of Use.{" "}
          <br />
          Please read them carefully.
        </div>
        <div className="">
          <ol className="list-decimal px-5 py-8">
            <li className="">
              <div className="text-lg">Acceptance of Terms</div>
              <div className="px-5">
                By accessing or using Vibie, you confirm that you are at least
                13 years old and have the legal capacity to enter into this
                agreement.
              </div>
            </li>
            <li className="mt-5">
              <div className="text-lg">User Accounts</div>
              To use Vibie, you must create an account
              <ul className="list-disc px-5">
                <li>
                  Account Responsibility: You are responsible for maintaining
                  the security of your account.
                </li>
                <li>
                  Accurate Information: Provide accurate and up-to-date
                  information when creating your account.
                </li>
                <li>
                  Account Termination: We reserve the right to terminate
                  accounts for violating these terms.
                </li>
              </ul>
            </li>
            <li className="mt-5">
              <div className="text-lg">Prohibited Activities</div>
              You are not to:
              <ul className="list-disc px-5">
                <li>
                  Post content that is illegal, harmful, obscene, hateful, or
                  violates any laws or rights.
                </li>
                <li>
                  Use Vibie for any unlawful purpose or to engage in fraudulent
                  activities.
                </li>
                <li>Impersonate another person, business, or entity.</li>
                <li>Interfere with the operation of Vibie or its systems.</li>
                <li>
                  Collect or store other users’ personal data without consent.
                </li>
              </ul>
              <span>
                We reserve the right to remove content or suspend accounts that
                violate these terms.
              </span>
            </li>
            <li className="mt-5">
              <div className="text-lg">User Content</div>
              <ul className="list-disc px-5">
                <li>
                  <div className="text-lg">Ownership</div>
                  <div>
                    You retain ownership of the content you upload (e.g.,
                    photos, videos, captions). By posting content, you grant
                    Vibie a non-exclusive, worldwide, royalty-free license to
                    display, reproduce, and distribute your content on the
                    platform.
                  </div>
                </li>
                <li className="mt-3">
                  <div className="text-lg">Content Responsibility</div>
                  <div>
                    You are solely responsible for the content you post. Vibie
                    is not liable for any user-generated content.
                  </div>
                </li>
              </ul>
            </li>
            <li className="mt-5">
              <div className="text-lg">Intellectual Property</div>
              <div className="px-3">
                All intellectual property on Vibie, including its logo, design,
                and features, belongs to Vibie or its licensors. You may not
                copy, distribute, or reproduce any part of Vibie without written
                consent.
              </div>
            </li>
            <li className="mt-5">
              <div className="text-lg">Privacy</div>
              <div className="px-3">
                Your use of Vibie is subject to our{" "}
                <span className="underline">
                  <Link to="/privacypolicy">Privacy Policy</Link>
                </span>
                . Please review it to understand how we collect, use, and
                protect your data.
              </div>
            </li>

            <li className="mt-5">
              <div className="text-lg">Limitation of Liability</div>
              Vibie is provided “as is.” We do not guarantee uninterrupted or
              error-free service. Vibie is not liable for:
              <ul className="list-disc px-5">
                <li>Loss or damage to your data.</li>
                <li>
                  Harm resulting from unauthorized access to your account.
                </li>
                <li>Content or actions of other users.</li>
              </ul>
            </li>

            <li className="mt-5">
              <div className="text-lg">Changes To Terms</div>
              <div className="px-3">
                We may update these Terms of Use from time to time. Changes will
                be notified through the app or via email. <br />
                Your continued use of Vibie signifies acceptance of the updated
                terms.
              </div>
            </li>

            <li className="mt-5">
              <div className="text-lg">Termination</div>
              <div className="px-3">
                You may terminate your account at any time by contacting us at
                <a
                  href="mailto:thisisayudh@gmail.com"
                  className="underline cursor-pointer"
                >
                  Vibie Support
                </a>{" "}
                . <br />
                We reserve the right to terminate or suspend your account for
                violations of these terms.
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
export default TermsOfUse;
