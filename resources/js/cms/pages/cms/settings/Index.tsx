import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import CMSLayout from '@/cms/layouts/CMSLayout';
import type { SiteSetting } from '@/cms/types/cms';

interface Props {
    settings: SiteSetting;
    admin: {
        email: string;
    };
}

export default function SettingsIndex({ settings, admin }: Props) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        header_phone: settings.header_phone ?? '',
        footer_phone: settings.footer_phone ?? '',
        footer_email: settings.footer_email ?? '',
        whatsapp_number: settings.whatsapp_number ?? '',
        messenger_link: settings.messenger_link ?? '',
        trade_license_number: settings.trade_license_number ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('update-settings'), {
            preserveScroll: true,
        });
    };

    const {
        data: credentialsData,
        setData: setCredentialsData,
        post: postCredentials,
        processing: credentialsProcessing,
        errors: credentialsErrors,
        clearErrors: clearCredentialsErrors,
        reset: resetCredentials,
    } = useForm({
        current_password: '',
        email: admin.email,
        password: '',
        password_confirmation: '',
    });

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postCredentials(route('update-admin-credentials'), {
            preserveScroll: true,
            onSuccess: () => {
                resetCredentials('current_password', 'password', 'password_confirmation');
            },
        });
    };

    return (
        <CMSLayout title="Site Settings" breadcrumb="Site Settings">
            <div className="page-header">
                <h2>Site Settings</h2>
                <p>
                    Control the contact numbers, email address, and chat widget
                    links shown across the public website
                </p>
                <div className="gold-line" />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="section-card">
                    <div className="section-title">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Header &amp; Footer Contact Numbers
                    </div>

                    <div className="form-row cols-2">
                        <div className="form-group">
                            <label>
                                Header &ldquo;Call Now&rdquo; Phone Number
                            </label>
                            <input
                                type="text"
                                value={data.header_phone}
                                onChange={(e) => {
                                    clearErrors('header_phone');
                                    setData('header_phone', e.target.value);
                                }}
                                placeholder="e.g. +8801928568853"
                            />
                            {errors.header_phone && (
                                <span
                                    style={{
                                        marginTop: 4,
                                        display: 'block',
                                        color: '#FF8080',
                                        fontSize: '0.78rem',
                                    }}
                                >
                                    {errors.header_phone}
                                </span>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Footer Phone Number</label>
                            <input
                                type="text"
                                value={data.footer_phone}
                                onChange={(e) => {
                                    clearErrors('footer_phone');
                                    setData('footer_phone', e.target.value);
                                }}
                                placeholder="e.g. +8801928568853"
                            />
                            {errors.footer_phone && (
                                <span
                                    style={{
                                        marginTop: 4,
                                        display: 'block',
                                        color: '#FF8080',
                                        fontSize: '0.78rem',
                                    }}
                                >
                                    {errors.footer_phone}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Footer Email Address</label>
                        <input
                            type="text"
                            value={data.footer_email}
                            onChange={(e) => {
                                clearErrors('footer_email');
                                setData('footer_email', e.target.value);
                            }}
                            placeholder="e.g. info@alliancebuildersltd.org"
                        />
                        {errors.footer_email && (
                            <span
                                style={{
                                    marginTop: 4,
                                    display: 'block',
                                    color: '#FF8080',
                                    fontSize: '0.78rem',
                                }}
                            >
                                {errors.footer_email}
                            </span>
                        )}
                    </div>
                </div>

                <div className="section-card">
                    <div className="section-title">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                        Chat Widget Links (WhatsApp &amp; Messenger)
                    </div>

                    <div className="form-row cols-2">
                        <div className="form-group">
                            <label>WhatsApp Number</label>
                            <input
                                type="text"
                                value={data.whatsapp_number}
                                onChange={(e) => {
                                    clearErrors('whatsapp_number');
                                    setData('whatsapp_number', e.target.value);
                                }}
                                placeholder="e.g. +8801928568853"
                            />
                            {errors.whatsapp_number && (
                                <span
                                    style={{
                                        marginTop: 4,
                                        display: 'block',
                                        color: '#FF8080',
                                        fontSize: '0.78rem',
                                    }}
                                >
                                    {errors.whatsapp_number}
                                </span>
                            )}
                            <p
                                style={{
                                    marginTop: 6,
                                    fontSize: '0.72rem',
                                    color: 'var(--muted)',
                                }}
                            >
                                Include the country code. Used to build the
                                wa.me chat link on the floating widget.
                            </p>
                        </div>
                        <div className="form-group">
                            <label>Messenger Page ID or Link</label>
                            <input
                                type="text"
                                value={data.messenger_link}
                                onChange={(e) => {
                                    clearErrors('messenger_link');
                                    setData('messenger_link', e.target.value);
                                }}
                                placeholder="e.g. alliancebuilderslimited"
                            />
                            {errors.messenger_link && (
                                <span
                                    style={{
                                        marginTop: 4,
                                        display: 'block',
                                        color: '#FF8080',
                                        fontSize: '0.78rem',
                                    }}
                                >
                                    {errors.messenger_link}
                                </span>
                            )}
                            <p
                                style={{
                                    marginTop: 6,
                                    fontSize: '0.72rem',
                                    color: 'var(--muted)',
                                }}
                            >
                                Either your Facebook page username/ID (used as
                                m.me/&#123;id&#125;), or a full link starting
                                with http.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="section-card">
                    <div className="section-title">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        Trade License
                    </div>

                    <div className="form-group">
                        <label>Trade License Number</label>
                        <input
                            type="text"
                            value={data.trade_license_number}
                            onChange={(e) => {
                                clearErrors('trade_license_number');
                                setData('trade_license_number', e.target.value);
                            }}
                            placeholder="e.g. TRAD/DNCC/060686/2022"
                        />
                        {errors.trade_license_number && (
                            <span
                                style={{
                                    marginTop: 4,
                                    display: 'block',
                                    color: '#FF8080',
                                    fontSize: '0.78rem',
                                }}
                            >
                                {errors.trade_license_number}
                            </span>
                        )}
                        <p
                            style={{
                                marginTop: 6,
                                fontSize: '0.72rem',
                                color: 'var(--muted)',
                            }}
                        >
                            Shown in the website footer. Leave empty to hide it.
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={processing}
                >
                    {processing ? 'Saving...' : 'Save Settings'}
                </button>
            </form>

            <form onSubmit={handleCredentialsSubmit}>
                <div className="section-card">
                    <div className="section-title">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Login Email &amp; Password
                    </div>

                    <p
                        style={{
                            marginTop: -8,
                            marginBottom: 18,
                            fontSize: '0.78rem',
                            color: 'var(--muted)',
                        }}
                    >
                        Change the email and password used to log into this
                        dashboard. Your current password is required to
                        confirm any change.
                    </p>

                    <div className="form-group">
                        <label>
                            Current Password{' '}
                            <span style={{ color: '#FF8080' }}>*</span>
                        </label>
                        <input
                            type="password"
                            required
                            autoComplete="current-password"
                            value={credentialsData.current_password}
                            onChange={(e) => {
                                clearCredentialsErrors('current_password');
                                setCredentialsData(
                                    'current_password',
                                    e.target.value,
                                );
                            }}
                            placeholder="Enter your current password"
                        />
                        {credentialsErrors.current_password && (
                            <span
                                style={{
                                    marginTop: 4,
                                    display: 'block',
                                    color: '#FF8080',
                                    fontSize: '0.78rem',
                                }}
                            >
                                {credentialsErrors.current_password}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            Login Email{' '}
                            <span style={{ color: '#FF8080' }}>*</span>
                        </label>
                        <input
                            type="text"
                            required
                            autoComplete="email"
                            value={credentialsData.email}
                            onChange={(e) => {
                                clearCredentialsErrors('email');
                                setCredentialsData('email', e.target.value);
                            }}
                            placeholder="admin@example.com"
                        />
                        {credentialsErrors.email && (
                            <span
                                style={{
                                    marginTop: 4,
                                    display: 'block',
                                    color: '#FF8080',
                                    fontSize: '0.78rem',
                                }}
                            >
                                {credentialsErrors.email}
                            </span>
                        )}
                    </div>

                    <div className="form-row cols-2">
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={credentialsData.password}
                                onChange={(e) => {
                                    clearCredentialsErrors('password');
                                    setCredentialsData(
                                        'password',
                                        e.target.value,
                                    );
                                }}
                                placeholder="Leave blank to keep current password"
                            />
                            {credentialsErrors.password && (
                                <span
                                    style={{
                                        marginTop: 4,
                                        display: 'block',
                                        color: '#FF8080',
                                        fontSize: '0.78rem',
                                    }}
                                >
                                    {credentialsErrors.password}
                                </span>
                            )}
                            <p
                                style={{
                                    marginTop: 6,
                                    fontSize: '0.72rem',
                                    color: 'var(--muted)',
                                }}
                            >
                                Minimum 8 characters, must include both
                                letters and numbers.
                            </p>
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={credentialsData.password_confirmation}
                                onChange={(e) => {
                                    clearCredentialsErrors(
                                        'password_confirmation',
                                    );
                                    setCredentialsData(
                                        'password_confirmation',
                                        e.target.value,
                                    );
                                }}
                                placeholder="Repeat the new password"
                            />
                            {credentialsErrors.password_confirmation && (
                                <span
                                    style={{
                                        marginTop: 4,
                                        display: 'block',
                                        color: '#FF8080',
                                        fontSize: '0.78rem',
                                    }}
                                >
                                    {credentialsErrors.password_confirmation}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={credentialsProcessing}
                    >
                        {credentialsProcessing
                            ? 'Saving...'
                            : 'Update Login Credentials'}
                    </button>
                </div>
            </form>
        </CMSLayout>
    );
}
