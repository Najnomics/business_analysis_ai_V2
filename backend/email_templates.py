# Email Templates for Somna AI
# Edit these templates to customize email content

# Password Reset Email Template
PASSWORD_RESET_SUBJECT = "Reset Your Password - Somna AI"
PASSWORD_RESET_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset - Somna AI</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }}
        .content {{ padding: 30px; background: #f9f9f9; }}
        .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 14px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Somna AI</h1>
            <p>Powered by Elite Global AI</p>
        </div>
        <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello {user_name},</p>
            <p>We received a request to reset your password for your Somna AI account. Click the button below to reset your password:</p>
            <a href="{reset_link}" class="button">Reset Password</a>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>Best regards,<br>The Somna AI Team</p>
        </div>
        <div class="footer">
            <p>© 2024 Somna AI - Elite Global AI. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
"""

# Welcome Email Template
WELCOME_SUBJECT = "Welcome to Somna AI! 🎉"
WELCOME_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to Somna AI</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }}
        .content {{ padding: 30px; background: #f9f9f9; }}
        .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 14px; }}
        .feature {{ margin: 15px 0; padding: 15px; background: white; border-radius: 5px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Welcome to Somna AI!</h1>
            <p>Powered by Elite Global AI</p>
        </div>
        <div class="content">
            <h2>Hello {user_name}! 👋</h2>
            <p>Thank you for joining Somna AI! We're excited to help you unlock the power of AI-driven business analysis.</p>
            
            <div class="feature">
                <h3>🎯 What You Can Do:</h3>
                <ul>
                    <li>📊 Comprehensive SWOT Analysis</li>
                    <li>🌍 PESTEL Analysis</li>
                    <li>⚡ Porter's Five Forces</li>
                    <li>🎨 Business Model Canvas</li>
                    <li>💎 VRIO Framework</li>
                    <li>📈 Financial Analysis</li>
                    <li>🛡️ Risk Assessment</li>
                    <li>And 18+ more advanced frameworks!</li>
                </ul>
            </div>
            
            <div class="feature">
                <h3>🔥 AI-Powered Features:</h3>
                <ul>
                    <li>Multi-AI consensus analysis (DeepSeek + Gemini)</li>
                    <li>Export to PDF, PowerPoint, and Word</li>
                    <li>Analysis history and management</li>
                    <li>Real-time processing updates</li>
                </ul>
            </div>
            
            <p>Ready to get started? Click the button below to access your dashboard:</p>
            <a href="{dashboard_link}" class="button">Go to Dashboard</a>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The Somna AI Team</p>
        </div>
        <div class="footer">
            <p>© 2024 Somna AI - Elite Global AI. All rights reserved.</p>
            <p>Need help? Contact us at support@somna-ai.com</p>
        </div>
    </div>
</body>
</html>
"""

# Analysis Complete Email Template
ANALYSIS_COMPLETE_SUBJECT = "Your Business Analysis is Ready! 📊"
ANALYSIS_COMPLETE_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Analysis Complete - Somna AI</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }}
        .content {{ padding: 30px; background: #f9f9f9; }}
        .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 14px; }}
        .stats {{ display: flex; justify-content: space-around; margin: 20px 0; }}
        .stat {{ text-align: center; }}
        .stat-number {{ font-size: 24px; font-weight: bold; color: #667eea; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Analysis Complete!</h1>
            <p>Your business analysis is ready</p>
        </div>
        <div class="content">
            <h2>Hello {user_name},</h2>
            <p>Great news! Your comprehensive business analysis for "<strong>{business_input}</strong>" has been completed.</p>
            
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">{frameworks_count}</div>
                    <div>Frameworks</div>
                </div>
                <div class="stat">
                    <div class="stat-number">{confidence_score}%</div>
                    <div>Confidence</div>
                </div>
                <div class="stat">
                    <div class="stat-number">{ai_models}</div>
                    <div>AI Models</div>
                </div>
            </div>
            
            <p>Your analysis includes insights from multiple AI models and covers 25+ business frameworks including SWOT, PESTEL, Porter's Five Forces, and many more.</p>
            
            <a href="{dashboard_link}" class="button">View Analysis Results</a>
            
            <p>You can also export your analysis as PDF, PowerPoint, or Word documents directly from your dashboard.</p>
            
            <p>Best regards,<br>The Somna AI Team</p>
        </div>
        <div class="footer">
            <p>© 2024 Somna AI - Elite Global AI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
"""