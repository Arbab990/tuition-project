# <img src="docs/icons/book.svg" width="28" height="28" alt=""> Studyfolk Learning Centre

Studyfolk helps families in India enquire about tuition and teachers apply to work as tutors. **Find tuition** opens the student enquiry panel. **Apply to tutor** opens the teacher application panel. Visitors can also contact the centre directly on [WhatsApp at +91 85779 55175](https://wa.me/918577955175).

## What visitors can do

| Feature | Behaviour |
| --- | --- |
| Explore the centre | Three photo slides move right every five seconds and loop. Visitors can pause, play, or choose a slide. Autoplay respects reduced-motion preferences. |
| Choose a pathway | Student and teacher cards explain what to prepare for each enquiry. Both pathways are public. The selected role lasts for the browser tab’s session. |
| Send an enquiry | Visitors fill out the Studyfolk fields for their selected role. The site displays a receipt after Google confirms submission. A role awaiting configuration displays a read-only preview and a closed-submissions message. |
| Contact the centre | WhatsApp links appear in the enquiry section and footer. |
| Browse on a phone | Navigation collapses into a menu, the layout stacks, and touch controls accommodate smaller screens. |

The site runs on React and Vite with Tailwind CSS, custom CSS, Framer Motion and Lucide React icons. Vercel serves static files. Vercel forwards enquiry posts to Google Forms through the rewrite in vercel.json. Vite proxies the same route during local development and preview. Google Sheets stores the responses. The browser stores only the role preference.

## <img src="docs/icons/terminal.svg" width="22" height="22" alt=""> Run locally

From the project directory, install the locked dependencies and start Vite.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To test the production version, run `npm run build` and then `npm run preview`. For a temporary client review through ngrok, point the tunnel at the preview port printed in the terminal. Keep both processes running while the client tests.

## <img src="docs/icons/sheet.svg" width="22" height="22" alt=""> Connect enquiries to the client’s Google Sheet

Both forms write to **one client-owned spreadsheet**, with a separate response tab for each role. Each submitted row includes a timestamp and the following details.

| Student enquiry | Teacher application |
| --- | --- |
| Student name | Teacher name |
| Parent or guardian email | Email address |
| Contact number | Contact number |
| City | City |
| Class and board | Subjects and classes taught |
| Subjects of interest | Qualifications and experience |
| Learning goals | Availability |

1. Sign in with the Google account that will own the forms. It needs **Editor** access to the client’s spreadsheet. Open that sheet and select **Extensions → Apps Script**.
2. Paste the [setup script](google-sheets/setup.gs) into the bound script project. Save, select **setupStudyfolkForms**, click **Run**, and review the Forms and Sheets permissions. The script checks the destination sheet ID before creating either form.
3. Copy both lines beginning with `VITE_` from the **Execution log**. Paste them into `.env.local` in the project root. The variable names are `VITE_STUDENT_FORM_URL` and `VITE_TEACHER_FORM_URL`. Each value must be the full public Google Forms respondent URL ending in `/viewform`. Restart Vite after changing the file.
4. Open the website in a signed-out browser. Submit one fictional enquiry per role and check that the timestamp and all seven answers reach the correct response tab. If a form requests sign-in, check its responder access in Google Forms. The response spreadsheet can remain restricted to staff.

Run the setup script again in the same Apps Script project to retrieve the links. It reuses the forms recorded by that project.

## <img src="docs/icons/upload.svg" width="22" height="22" alt=""> Deploy on Vercel

Import the repository and use these project settings.

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | `VITE_STUDENT_FORM_URL` and `VITE_TEACHER_FORM_URL` |

Local builds read the form links from the ignored `.env` or `.env.local` file. On Vercel, set both variables in the project’s environment settings and redeploy so the build includes the respondent URLs.

## Where to make changes

| To change | Edit |
| --- | --- |
| Hero text, slide timing, navigation, pathways or About section | [main.jsx](main.jsx) |
| Hero photography | [public/images](public/images/) |
| Layout, colours and responsive styles | [style.css](style.css) |
| Role-specific fields and submission handling | [Enquiry.jsx](Enquiry.jsx) and [form.css](form.css) |
| Live form questions | The corresponding form in Google Forms. Keep each Google question?s entry ID paired with its label in Enquiry.jsx. Recreating a question or form generates new IDs. Keep the confirmation message in sync with the setup script. |
| WhatsApp icon destination | Update the international-format chat link in [WhatsAppContact.jsx](WhatsAppContact.jsx). |
