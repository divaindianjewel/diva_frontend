/**
 * v0 by Vercel.
 * @see https://v0.dev/t/fePRFWsEtGh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";

export default function RakhiPackaging() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <h2 className="text-left p-10 text-3xl font-medium">
        Diva's Special Rakhi Packaging
      </h2>
      <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="grid gap-6 rounded-lg border bg-background p-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Basic Silver Rakhi</h3>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold">₹1299</div>
            <p className="text-muted-foreground">per box</p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 fill-primary" />
              <span>1 Silver Coin of wort ₹XXX</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 fill-primary" />
              <span>cadbury chocobakes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 fill-primary" />
              <span>Kum Kum</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 fill-primary" />
              <span>Akshada</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 fill-primary" />
              <span>ferrero rocher</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Shop Now
          </Button>
        </div>
        <div className="grid gap-6 rounded-lg border bg-background p-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Special Silver Rakhi</h3>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold">₹1499</div>
            <p className="text-muted-foreground">per Box</p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 fill-primary" />
              <span>1 Silver Coin of wort ₹XXX</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 fill-primary" />
              <span>cadbury chocobakes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 fill-primary" />
              <span>Kum Kum</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 fill-primary" />
              <span>Akshada</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 fill-primary" />
              <span>ferrero rocher</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
