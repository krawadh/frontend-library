const apiUrl = import.meta.env.VITE_API_URL;
export const USER_API_END_POINT = apiUrl + "/auth";
export const JOB_API_END_POINT = apiUrl + "/job";
export const APPLICATION_API_END_POINT = apiUrl + "/application";
export const COMPANY_API_END_POINT = apiUrl + "/company";
export const SEAT_API_END_POINT = apiUrl + "/seating";
export const MEMBERSHIP_API_END_POINT = apiUrl + "/membership";
export const MEMBER_API_END_POINT = apiUrl + "/member";

export const MEMBERSHIP_TYPE = [
  "6-Hours",
  "8-Hours",
  "10-Hours",
  "12-Hours",
  "16-Hours",
  "Reserved",
  "Reserved Discrete",
  "Locker",
];
export const MEMBERSHIP_DURATION = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Half-yearly",
  "Yearly",
];
