<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Job Application</title>
</head>
<body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
            <td style="background:#0b1f33;padding:20px 28px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0.7;">{{ config('app.name') }}</div>
                <div style="font-size:20px;font-weight:bold;margin-top:4px;">New Job Application</div>
            </td>
        </tr>
        <tr>
            <td style="padding:24px 28px;">
                <p style="margin:0 0 16px;">A new application has been submitted through the Career page.</p>
                <table role="presentation" width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                    <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="width:140px;color:#6b7280;">Position</td>
                        <td style="font-weight:bold;">{{ $application->job_title }}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="color:#6b7280;">Name</td>
                        <td>{{ $application->name }}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="color:#6b7280;">Phone</td>
                        <td>{{ $application->phone }}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="color:#6b7280;">Email</td>
                        <td>{{ $application->email }}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #e5e7eb;">
                        <td style="color:#6b7280;">Submitted</td>
                        <td>{{ $application->created_at->format('d M Y, h:i A') }}</td>
                    </tr>
                </table>
                <p style="margin:20px 0 6px;color:#6b7280;font-size:14px;">Cover Letter</p>
                <div style="white-space:pre-line;font-size:14px;line-height:1.6;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:14px;">{{ $application->message }}</div>
                <p style="margin:20px 0 0;font-size:13px;color:#6b7280;">The candidate's CV is attached ({{ $application->cv_original_name }}). You can reply directly to this email to contact the candidate.</p>
            </td>
        </tr>
    </table>
</body>
</html>
