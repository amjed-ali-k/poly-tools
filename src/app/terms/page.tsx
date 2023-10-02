/* eslint-disable react/no-unescaped-entities */
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
        <h1>Terms and conditions of use</h1>
        <p>
          Poly Tools App (https://poly-tools.vercel.app) is committed to
          ensuring that the app is as useful and efficient as possible. For that
          reason, we reserve the right to make changes to the app or to charge
          for its services at any time and for any reason. We will not charge
          you for the app or its services without making it clear to you exactly
          what you’re paying for.
        </p>
        <p>
          Please note that there are certain things that Poly Tools App
          (https://poly-tools.vercel.app) will not take responsibility for.
          Certain functions of the app will require an active internet
          connection. The connection can be Wi-Fi or provided by your mobile
          network provider, but Poly Tools App (https://poly-tools.vercel.app)
          cannot take responsibility if the app doesn't work at full
          functionality due to a lack of Wi-Fi or data allowance.
        </p>
        <p>
          If you use the app outside an area with Wi-Fi, your terms of agreement
          with your mobile network provider will still apply. As a result, you
          may be charged by your mobile provider for the cost of data for the
          duration of the connection while accessing the app, or other
          third-party charges. By using the app, you're accepting responsibility
          for any such charges, including roaming data charges if you use the
          app outside of your home territory (i.e., region or country) without
          turning off data roaming. If you're not the bill payer for the device
          on which you’re using the app, please be aware that we assume that you
          have received permission from the bill payer to use the app.
        </p>
        <p>
          Along the same lines, Poly Tools App (https://poly-tools.vercel.app)
          cannot always take responsibility for the way you use the app, such as
          ensuring that your device stays charged. If your device runs out of
          battery and you can't turn it on to avail of the service, Poly Tools
          App (https://poly-tools.vercel.app) cannot accept responsibility.
        </p>
        <p>
          Concerning Poly Tools App (https://poly-tools.vercel.app)’s
          responsibility for your use of the app, it's important to bear in mind
          that although we endeavor to ensure that it is updated and correct at
          all times, we do rely on third parties to provide information to us so
          that we can make it available to you. Poly Tools App
          (https://poly-tools.vercel.app) accepts no liability for any loss,
          direct or indirect, you experience as a result of relying solely on
          the functionality of the app.
        </p>
        <p>
          At some point, we may wish to update the app. The app is currently
          available on the web and CLI – the requirements for both systems (and
          for any additional systems we decide to extend the availability of the
          app to) may change, and you’ll need to download the updates if you
          want to keep using the app. Poly Tools App
          (https://poly-tools.vercel.app) does not promise that it will always
          update the app so that it is relevant to you and/or works with the web
          & CLI version that you have installed on your device. However, you
          promise to accept updates to the application when offered to you. We
          may also wish to stop providing the app and terminate its use at any
          time without giving notice of termination to you. Unless we tell you
          otherwise, upon any termination, (a) the rights and licenses granted
          to you in these terms will end; (b) you must stop using the app, and
          (if needed) delete it from your device.
        </p>
        <h3>Changes to these terms and conditions</h3>
        <p>
          We may update our terms and conditions from time to time. Thus, you
          are advised to review this page periodically for any changes. We will
          notify you of any changes by posting the new terms and conditions on
          this page. These terms and conditions are effective as of 2023-04-08.
        </p>
        <h3>Contact us</h3>
        <p>
          If you have any questions or suggestions about our privacy policy, do
          not hesitate to contact us at amjedmgm@gmail.com.
        </p>{" "}
      </div>
    </div>
  );
}
