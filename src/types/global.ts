export type userTypeProp = "admin" | "moderator" | "executive" | "exhibit" | "analysis" | "temporary"

export interface profileProp {
  userId: string;
  display_name: string;
  user_type: userTypeProp;
  role: string;
  available: boolean;
  note: string;
}

export interface exhibitProp {
  exhibit_id: string;
  exhibit_name: string;
}

export interface generalFailedProp {
  status: "error";
  message: string;
}