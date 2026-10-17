import "server-only";

import { ImageResponse } from "next/og";

import { SITE_NAME, SOCIAL_IMAGE_SIZE } from "@/lib/site";
import { prepareSocialTitle } from "@/lib/social-title";

type SocialImageProps = {
  title: string;
};

function SealMark() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        height: 64,
        justifyContent: "center",
        position: "relative",
        width: 66,
      }}
    >
      <svg
        aria-hidden="true"
        height="64"
        viewBox="0 0 22.5464 22.1948"
        width="66"
        style={{ position: "absolute" }}
      >
        <path
          d="M5.17456 19.5593H7.2937C7.48902 19.5593 7.6355 19.6179 7.78199 19.7644L9.28589 21.2585C10.5164 22.4988 11.6589 22.489 12.8894 21.2585L14.3933 19.7644C14.5496 19.6179 14.6863 19.5593 14.8914 19.5593H17.0007C18.7488 19.5593 19.5593 18.7585 19.5593 17.0007V14.8914C19.5593 14.6863 19.6179 14.5496 19.7644 14.3933L21.2585 12.8894C22.4988 11.6589 22.489 10.5164 21.2585 9.28589L19.7644 7.78199C19.6179 7.6355 19.5593 7.48902 19.5593 7.2937V5.17456C19.5593 3.43628 18.7585 2.61597 17.0007 2.61597H14.8914C14.6863 2.61597 14.5496 2.56714 14.3933 2.42066L12.8894 0.926517C11.6589-0.313717 10.5164-0.303951 9.28589 0.926517L7.78199 2.42066C7.6355 2.56714 7.48902 2.61597 7.2937 2.61597H5.17456C3.42652 2.61597 2.61597 3.41675 2.61597 5.17456V7.2937C2.61597 7.48902 2.56714 7.6355 2.42066 7.78199L0.926517 9.28589C-0.313717 10.5164-0.303951 11.6589 0.926517 12.8894L2.42066 14.3933C2.56714 14.5496 2.61597 14.6863 2.61597 14.8914V17.0007C2.61597 18.7488 3.42652 19.5593 5.17456 19.5593Z"
          fill="#df8f93"
        />
      </svg>
      <span
        style={{
          color: "#ffffff",
          fontFamily: "geist",
          fontSize: 30,
          fontWeight: 700,
          lineHeight: 1,
          position: "relative",
        }}
      >
        S
      </span>
    </div>
  );
}

export async function createSocialImage({ title }: SocialImageProps) {
  const preparedTitle = prepareSocialTitle(title);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#f4f1ea",
          color: "#18181b",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          padding: "64px 112px 68px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            borderLeft: "2px dashed rgba(24, 24, 27, 0.16)",
            bottom: 0,
            display: "flex",
            left: 72,
            position: "absolute",
            top: 0,
          }}
        />
        <div
          style={{
            borderLeft: "2px dashed rgba(24, 24, 27, 0.16)",
            bottom: 0,
            display: "flex",
            position: "absolute",
            right: 72,
            top: 0,
          }}
        />

        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 18,
            }}
          >
            <SealMark />
            <span
              style={{
                color: "#3f3f46",
                fontFamily: "geist",
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {SITE_NAME}
            </span>
          </div>

          <span
            style={{
              color: "#71717a",
              fontFamily: "geist",
              fontSize: 18,
              letterSpacing: "0.04em",
            }}
          >
            stevensarmi.com
          </span>
        </div>

        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            flex: 1,
            justifyContent: "center",
            flexDirection: "column",
            maxWidth: 1000,
            paddingTop: 22,
          }}
        >
          <div
            style={{
              background: "#b95f65",
              display: "flex",
              height: 5,
              marginBottom: 28,
              width: 72,
            }}
          />
          <div
            style={{
              color: "#18181b",
              display: "flex",
              fontFamily: "geist",
              fontSize: preparedTitle.fontSize,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1.04,
              textWrap: "balance",
            }}
          >
            {preparedTitle.text}
          </div>
        </div>
      </div>
    ),
    {
      ...SOCIAL_IMAGE_SIZE,
    },
  );
}
