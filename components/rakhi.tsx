import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Rakhi() {
  return (
    <div className="grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-fit">
      <RadioGroup>
        <div className="grid gap-4">
          <div className="flex items-center gap-4 rounded-lg bg-background p-4 shadow-sm transition-colors hover:bg-muted">
            <RadioGroupItem value="product1" className="peer sr-only" />
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              
              <img
                src="/placeholder.svg"
                alt="Product 1"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />

            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium">Product 1</h3>
              <p className="text-sm text-muted-foreground">Description of Product 1</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
              <CheckIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-background p-4 shadow-sm transition-colors hover:bg-muted">
            <RadioGroupItem value="product2" className="peer sr-only" />
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              <img
                src="/placeholder.svg"
                alt="Product 2"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium">Product 2</h3>
              <p className="text-sm text-muted-foreground">Description of Product 2</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
              <CheckIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-background p-4 shadow-sm transition-colors hover:bg-muted">
            <RadioGroupItem value="product3" className="peer sr-only" />
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              <img
                src="/placeholder.svg"
                alt="Product 3"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium">Product 3</h3>
              <p className="text-sm text-muted-foreground">Description of Product 3</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
              <CheckIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-background p-4 shadow-sm transition-colors hover:bg-muted">
            <RadioGroupItem value="product4" className="peer sr-only" />
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              <img
                src="/placeholder.svg"
                alt="Product 4"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium">Product 4</h3>
              <p className="text-sm text-muted-foreground">Description of Product 4</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
              <CheckIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-background p-4 shadow-sm transition-colors hover:bg-muted">
            <RadioGroupItem value="product5" className="peer sr-only" />
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              <img
                src="/placeholder.svg"
                alt="Product 5"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium">Product 5</h3>
              <p className="text-sm text-muted-foreground">Description of Product 5</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
              <CheckIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-background p-4 shadow-sm transition-colors hover:bg-muted">
            <RadioGroupItem value="product6" className="peer sr-only" />
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              <img
                src="/placeholder.svg"
                alt="Product 6"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium">Product 6</h3>
              <p className="text-sm text-muted-foreground">Description of Product 6</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
              <CheckIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}

function CheckIcon(props : any) {
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
  )
}


function XIcon(props : any) {
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
  )
}