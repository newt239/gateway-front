export type UserType = "moderator" | "executive" | "exhibit";
export type GuestType = "student" | "teacher" | "family" | "other";
export type ExhibitType = "class" | "club" | "stage" | "other";

export interface ProfileProps {
  user_id: string;
  display_name: string;
  user_type: string;
  available: number;
}

export interface ReservationInfoProps {
  reservation_id: string;
  guest_type: string;
  part: number;
  count: number;
  registered: {
    guest_id: string;
    is_spare: number;
  }[];
  available: number;
}

export interface ExhibitProps {
  exhibit_id: string;
  group_name: string;
  exhibit_name: string;
}

export type GuestInfoProps = {
  guest_id: string;
  guest_type: string;
  reservation_id: string;
  part: number;
  available: number;
};

export interface GuestsInfoSuccessProps {
  status: "success";
  data: GuestInfoProps;
}

export type ExhibitCurrentGuestProps = {
  id: string;
  guest_type: GuestType;
  enter_at: string;
};