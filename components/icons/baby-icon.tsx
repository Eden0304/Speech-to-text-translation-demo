import type React from "react"
// components/icons/baby-icon.tsx
import { Baby } from "lucide-react"

export default function BabyIcon({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <Baby className={className} {...props} />
}
