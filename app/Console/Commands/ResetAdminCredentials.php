<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class ResetAdminCredentials extends Command
{
    protected $signature = 'admin:reset-credentials
        {--email= : New login email}
        {--password= : New login password (min 8 chars, letters + numbers)}
        {--force : Skip the confirmation prompt}';

    protected $description = "Replace the site's single admin login email and password (use this if the admin is locked out)";

    public function handle(): int
    {
        $user = User::first();

        if (! $user) {
            $this->warn('No admin user exists yet — one will be created.');
        }

        $email = $this->option('email') ?: $this->ask('New login email', $user?->email);
        $password = $this->option('password') ?: $this->secret('New login password (min 8 chars, letters + numbers mixed)');

        $validator = Validator::make(
            ['email' => $email, 'password' => $password],
            [
                'email' => ['required', 'string', 'email', 'max:255'],
                'password' => ['required', 'string', Password::min(8)->letters()->numbers()],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        if (! $this->option('force') && ! $this->confirm("Replace the admin's login email with [{$email}] and set the new password?")) {
            $this->info('Cancelled — nothing was changed.');

            return self::SUCCESS;
        }

        $user ??= new User(['name' => 'Admin']);
        $user->email = $email;
        $user->password = $password; // auto-hashed by the User model's 'hashed' cast
        $user->save();

        $this->info('Admin login credentials updated successfully.');

        return self::SUCCESS;
    }
}
