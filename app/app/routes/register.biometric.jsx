import React, { useState, useEffect } from 'react';
import { ClientOnly } from 'remix-utils'; 
import styleCss from "~/styles/card.css";
import RegisterBiometricView from '../views/register/biometric.view';
import { getRegistrationChallenge } from "~/models/biometric.server";
import { useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/cookies";
import { json, redirect } from '@remix-run/node';
import { postRegistrationResult } from '../models/biometric.server';



export const handle = { hydrate: true };

export const meta = () => {
    return [{ title: "Add biometric auth" }];
};

export const links = () => [
    { rel: "stylesheet", href: styleCss },
]

export const loader = async ({ request }) => {
    const session = await requireUserSession(request);

    const attestation = await getRegistrationChallenge(session.get("token"));


    return json({ attestation });
};

export const action = async ({ request }) => {
    

    const session = await requireUserSession(request);
    const jwtToken = session.get("token");

    const form = await request.formData();
    
    const encodedCredential = JSON.parse(form.get("encodedCredential"));

    // tot errror hanlding
    await postRegistrationResult(jwtToken, encodedCredential);

    return redirect("/");
};

export default function RegisterBiometricController() {
    const { attestation, jwtToken } = useLoaderData();

    return (
        <RegisterBiometricView attestation={attestation} jwtToken={jwtToken}/>
    );
}