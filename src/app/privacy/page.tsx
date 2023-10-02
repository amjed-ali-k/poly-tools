import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Index() {
  return (
    <div className="container mt-32">
      <div className="prose md:prose-lg prose-sm xl:prose-xl prose-invert  prose-headings:underline">
        <Link href={"/"}>
          <p className="flex items-center">
            <span className="mr-2">
              <ArrowLeft />
            </span>
            Back to home
          </p>
        </Link>
        <h1>Privacy Policy</h1>
        <p>
          Poly Tools app (https://poly-tools.vercel.app) as an Open Source app.
          This Service is provided by PolyTools Team at no cost and is intended
          for use as is. This page is used to inform visitors regarding our
          policies regarding the collection, use, and disclosure of Personal
          Information if anyone decides to use our Service. If you choose to use
          our Service, then you agree to the collection and use of information
          about this policy. The Personal Information that we collect is used
          for providing and improving the Service. We will not use or share your
          information with anyone except as described in this privacy policy.
          The terms used in this privacy policy have the same meanings as in our
          Terms and Conditions, which are accessible at PolyTools unless
          otherwise defined in this privacy policy.
        </p>
        <h3>Service providers</h3>
        <p>
          We may employ third-party companies and individuals due to the
          following reasons:
        </p>
        <ul>
          <li>To facilitate our Service;</li>
          <li>To provide the Service on our behalf;</li>
          <li>To perform Service-related services; or</li>
          <li>To assist us in analyzing how our Service is used.</li>
        </ul>
        <p>
          We want to inform users of this Service that these third parties have
          access to your Personal Information. The reason is to perform the
          tasks assigned to them on our behalf. However, they are obligated not
          to disclose or use the information for any other purpose.
        </p>
        <h3>Security</h3>
        <p>
          We value your trust in providing us with your Personal Information,
          thus we are striving to use commercially acceptable means of
          protecting it. But remember that no method of transmission over the
          internet, or method of electronic storage is 100% secure and reliable,
          and we cannot guarantee its absolute security.
        </p>
        <h3>Links to other sites</h3>
        <p>
          This Service may contain links to other sites. If you click on a
          third-party link, you will be directed to that site. Note that these
          external sites are not operated by us. Therefore, we strongly advise
          you to review the privacy policy of these websites. We have no control
          over and assume no responsibility for the content, privacy policies,
          or practices of any third-party sites or services.
        </p>
        <h3>Children’s privacy</h3>
        <p>
          These Services do not address anyone under the age of 13. We do not
          knowingly collect personally identifiable information from children
          under 13 years of age. In the case we discover that a child under 13
          has provided us with personal information, we immediately delete this
          from our servers. If you are a parent or guardian and you are aware
          that your child has provided us with personal information, please
          contact us so that we will be able to take the necessary actions.
        </p>
        <h3>Changes to this privacy policy</h3>
        <p>
          We may update our privacy policy from time to time. Thus, you are
          advised to review this page periodically for any changes. We will
          notify you of any changes by posting the new privacy policy on this
          page.
        </p>
        <p>This policy is effective as of 2023-04-08</p>
        <h3>Contact us</h3>
        <p>
          If you have any questions or suggestions about our privacy policy, do
          not hesitate to contact us at amjedmgm@gmail.com.
        </p>{" "}
      </div>
    </div>
  );
}
