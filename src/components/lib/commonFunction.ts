import crypto from 'crypto-js'

import generalProps from "./generalProps";

export const getTimePart = (part: number) => {
  const time_part = generalProps.time_part;
  if (part < time_part.length) {
    return time_part[part];
  } else {
    return {
      part_name: "無効な時間帯",
      start: "",
      end: "",
    };
  }
};

export const guestIdValidation = (guest_id: string) => {
  if (guest_id.length === 10) {
    if (guest_id.startsWith("G")) {
      const guestIdNumberList = Array.from(guest_id.slice(1)).map((nstr) =>
        Number(nstr)
      );
      const sumStr = String(
        guestIdNumberList.slice(0, 8).reduce((sum, n) => {
          return sum + n;
        }, 0)
      );
      const onesPlaceOfSum = Number(sumStr[sumStr.length - 1]);
      const checkSum = guestIdNumberList[guestIdNumberList.length - 1];
      if (onesPlaceOfSum === checkSum) {
        return true;
      }
    }
  }
  return false;
};

export const decodeReservationQRCode = (token: string) => {
  const signature = process.env.REACT_APP_JWT_SIGNATURE;
  if (signature) {
    // QRコードを生成する過程でプラスがスペースに変換されてしまうので元に戻す
    const bytes = crypto.AES.decrypt(token.replace(/ /g, "+"), signature);
    const originalText = bytes.toString(crypto.enc.Utf8);
    return originalText;
  }
  return null;
};

export const reservationIdValidation = (reservation_id: string) => {
  if (reservation_id.length === 7) {
    if (reservation_id.startsWith("R")) {
      const guestIdNumberList = Array.from(reservation_id.slice(1)).map(
        (nstr) => Number(nstr)
      );
      if (guestIdNumberList[0] <= 2) {
        return true;
      }
    }
  }
  return false;
};
