const generalProps = {
    "reservation": {
        "guest_type": {
            "general": "一般",
            "student": "生徒",
            "family": "保護者",
            "special": "来賓"
        }
    },
    "guest": {
        "guest_type": {
            "general": "一般",
            "student": "生徒",
            "family": "保護者",
            "special": "来賓"
        }
    },
};

export default generalProps;

export type exhibitCurrentGuestProp = {
    id: string;
    guest_type: "general" | "student" | "family" | "special";
    enter_at: string;
}

export type profileStateProp = {
    userId: string;
    display_name: string;
    user_type: string;
    role: string;
    available: boolean;
    note: string;
};

export type userTypeProp = "admin" | "moderator" | "executive" | "exhibit" | "analysis" | "temporary"