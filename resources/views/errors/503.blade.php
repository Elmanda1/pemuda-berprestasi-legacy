<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sedang Dalam Perbaikan | {{ config('app.name') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: rgb(153, 13, 53); /* CJV Red */
            --primary-dark: rgb(120, 10, 40);
            --accent: rgb(245, 183, 0);  /* CJV Yellow */
            --bg-dark: rgb(245, 251, 239); /* CJV White */
            --bg-card: rgba(255, 255, 255, 0.9);
            --text-primary: rgb(5, 5, 5);      /* CJV Black */
            --text-secondary: rgba(5, 5, 5, 0.6);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }

        /* Animated gradient background */
        body::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 30% 30%, rgba(153, 13, 53, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 70% 70%, rgba(245, 183, 0, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(153, 13, 53, 0.05) 0%, transparent 60%);
            animation: pulse 15s ease-in-out infinite;
            z-index: 0;
        }

        @keyframes pulse {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-5%, -5%) scale(1.1); }
        }

        /* Floating particles */
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(153, 13, 53, 0.2);
            border-radius: 50%;
            animation: float 20s infinite;
        }

        .particle:nth-child(1) { left: 10%; animation-delay: 0s; animation-duration: 25s; }
        .particle:nth-child(2) { left: 20%; animation-delay: 2s; animation-duration: 20s; }
        .particle:nth-child(3) { left: 30%; animation-delay: 4s; animation-duration: 28s; }
        .particle:nth-child(4) { left: 40%; animation-delay: 1s; animation-duration: 22s; }
        .particle:nth-child(5) { left: 50%; animation-delay: 3s; animation-duration: 18s; }
        .particle:nth-child(6) { left: 60%; animation-delay: 5s; animation-duration: 24s; }
        .particle:nth-child(7) { left: 70%; animation-delay: 2.5s; animation-duration: 26s; }
        .particle:nth-child(8) { left: 80%; animation-delay: 0.5s; animation-duration: 21s; }
        .particle:nth-child(9) { left: 90%; animation-delay: 3.5s; animation-duration: 23s; }

        @keyframes float {
            0% { 
                transform: translateY(100vh) rotate(0deg); 
                opacity: 0;
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { 
                transform: translateY(-100vh) rotate(720deg); 
                opacity: 0;
            }
        }

        .container {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 2rem;
            max-width: 600px;
        }

        .card {
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(153, 13, 53, 0.1);
            border-radius: 24px;
            padding: 3rem 2.5rem;
            box-shadow: 0 20px 40px -10px rgba(153, 13, 53, 0.1),
                        0 0 0 1px rgba(255, 255, 255, 1) inset;
        }

        .icon-wrapper {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: iconPulse 2s ease-in-out infinite;
        }

        @keyframes iconPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(153, 13, 53, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 30px 10px rgba(153, 13, 53, 0.1); }
        }

        .icon {
            width: 40px;
            height: 40px;
            color: white;
        }

        h1 {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
            letter-spacing: -0.02em;
        }

        p {
            font-size: 1rem;
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 2rem;
        }

        .status {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(153, 13, 53, 0.05);
            border: 1px solid rgba(153, 13, 53, 0.2);
            padding: 0.75rem 1.25rem;
            border-radius: 100px;
            font-size: 0.875rem;
            color: var(--primary);
            font-weight: 500;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        .footer {
            margin-top: 2rem;
            font-size: 0.75rem;
            color: var(--text-secondary);
            opacity: 0.6;
        }

        @media (max-width: 480px) {
            .card {
                padding: 2rem 1.5rem;
            }
            h1 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
    </div>

    <div class="container">
        <div class="card">
            <div class="icon-wrapper">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
            </div>
            <h1>Sedang Dalam Maintenance</h1>
            <p>Kami sedang melakukan pemeliharaan sistem untuk meningkatkan layanan. Silahkan kembali beberapa saat lagi.</p>
            <div class="footer">
                {{ config('app.name') }} &copy; {{ date('Y') }}
            </div>
        </div>
    </div>
</body>
</html>
