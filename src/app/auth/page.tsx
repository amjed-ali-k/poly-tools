import SBTEToolsLogo from "@/components/Logo";
import HankoAuth from "@/components/auth/HankoAuth";

export default function LoginPage() {
  return (
    <>
      <div className="container relative pt-20 lg:pt-0 h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2">
              <SBTEToolsLogo className="h-8 w-8 rounded-md bg-[#3178C6] p-[2px]" />
              <span className="font-bold leading-[14px]">
                Poly
                <br />
                Tools
              </span>
            </div>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This website has saved me countless hours of work and
                helped me analyse faster than ever before.&rdquo;
              </p>
              <footer className="text-sm">Sheeba MH</footer>
            </blockquote>
          </div>
        </div>
        <style>
          {`  .hankoComponent::part(headline1) {
  display:none!important;
  }`}
        </style>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create or Sign In
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to proceed
              </p>
            </div>
            <HankoAuth className="hankoComponent" />
          </div>
        </div>
      </div>
    </>
  );
}
