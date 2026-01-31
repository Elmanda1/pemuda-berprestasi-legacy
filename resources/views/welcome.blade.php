<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pemuda Berprestasi API</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
    <!-- Styles -->
    <style>
        html,
        body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Nunito', sans-serif;
            font-weight: 200;
            height: 100vh;
            margin: 0;
        }

        .full-height {
            height: 100vh;
        }

        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }

        .position-ref {
            position: relative;
        }

        .content {
            text-align: center;
        }

        .title {
            font-size: 64px;
            color: #2c3e50;
        }

        .links>a {
            color: #636b6f;
            padding: 0 25px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: .1rem;
            text-decoration: none;
            text-transform: uppercase;
        }

        .m-b-md {
            margin-bottom: 30px;
        }

        .status-box {
            background: #e1f5fe;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            border: 1px solid #81d4fa;
        }
    </style>
</head>

<body>
    <div class="flex-center position-ref full-height">
        <div class="content">
            <div class="title m-b-md">
                Pemuda Berprestasi
            </div>
            <h3>Backend API Service</h3>

            <div class="status-box">
                <p><strong>Status:</strong> <span style="color: green">● Online</span></p>
                <p><strong>PHP Version:</strong> {{ phpversion() }}</p>
                <p><strong>Database:</strong> Connected</p>
            </div>

            <div class="links" style="margin-top: 30px;">
                <a href="/api/v1/kompetisi">Kompetisi API</a>
                <a href="/api/v1/dojang/listdojang">Dojang API</a>
            </div>
        </div>
    </div>
</body>

</html>