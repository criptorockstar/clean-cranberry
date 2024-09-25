import type { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "Cranberry - Encuentranos",
  description: "Puedes encontrarnos en Google Maps",
};

export default function FindUsPage() {
  return (
    <React.Fragment>
      <div className="container mx-auto">
        <div className="flex justify-center mb-20 sm:mx-2">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.125042217536!2d-58.47843682494243!3d-34.62628025868883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc992ed2bf2c1%3A0xc3a3f864438045fa!2sCuenca%20497%2C%20C1406ARG%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires%2C%20Argentina!5e0!3m2!1ses-419!2suy!4v1725315128687!5m2!1ses-419!2suy"
            width="600"
            height="450"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </React.Fragment>
  );
};
