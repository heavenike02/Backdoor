export type PropertyApplication = {
    id: string
    type: "single" | "group"
    status: "pending" | "approved" | "rejected" | "shortlisted"
    occupantsCount: number
    desiredMoveInDate: Date
    applicationDate: Date
    lastUpdated: Date
  }