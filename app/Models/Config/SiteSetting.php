<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'header_phone',
        'footer_phone',
        'footer_email',
        'whatsapp_number',
        'messenger_link',
        'trade_license_number',
    ];
}
