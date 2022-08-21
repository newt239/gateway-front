import crypto from "crypto-js";
import axios, { AxiosError } from "axios";
import ReactGA from "react-ga4";

import generalProps from "#/components/lib/generalProps";
import moment from "moment";

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

export const handleApiError = (error: AxiosError, name: string) => {
  console.log(error);
  const env = process.env.REACT_APP_ENV;
  if (env && (env === "production" || env === "develop")) {
    ReactGA.event({
      category: `error_${name}`,
      action: error.message,
    });
    const url = process.env.REACT_APP_DISCORD_WEBHOOK_URL;
    if (url) {
      const config = {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };
      let content =
        "```timestamp: " + moment().format("MM/DD HH:mm:ss SSS") + "\n";
      const version =
        (process.env.REACT_APP_VERSION || "unknown") +
        "-" +
        (process.env.REACT_APP_ENV || "unknown");
      content += "version  : " + version + "\n";
      const userId = localStorage.getItem("user_id");
      if (userId) {
        content += "user_id  : " + userId + "\n";
      }
      content +=
        "type     : " + name + "\nlocation : " + window.location.pathname;
      if (error.code) {
        content += "\ncode     : " + error.code;
      }
      content +=
        "\nmessage  : " + error.message + "\n\n" + String(error) + "```";
      const postData = {
        username: "error log",
        embeds: [
          {
            title: "REQUEST ERROR",
            description: content,
            color: parseInt("a83232", 16),
          },
        ],
      };
      axios.post(url, postData, config).catch((err: AxiosError) => {
        console.log(err);
      });
    }
  }
};

export const sendLog = (message: string) => {
  const env = process.env.REACT_APP_ENV;
  if (env && (env === "production" || env === "develop")) {
    const url = process.env.REACT_APP_DISCORD_WEBHOOK_URL;
    if (url) {
      const config = {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };
      let content =
        "```timestamp: " + moment().format("MM/DD HH:mm:ss SSS") + "\n";
      const version =
        (process.env.REACT_APP_VERSION || "unknown") +
        "-" +
        (process.env.REACT_APP_ENV || "unknown");
      content += `version  : ${version}\n`;
      const userId = localStorage.getItem("user_id");
      if (userId) {
        content += `user_id  : ${userId}\n`;
      }
      content += `location : ${window.location.pathname}\n\n${message}`;
      content += "```";
      const postData = {
        username: "error log",
        embeds: [
          {
            title: "ERROR",
            description: content,
            color: parseInt("a83232", 16),
          },
        ],
      };
      axios.post(url, postData, config).catch((err: AxiosError) => {
        console.log(err);
      });
    }
  }
};
