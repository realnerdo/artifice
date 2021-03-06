<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Cotización</title>
    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
    <style>
        body{
            background-color: #f8f8f8;
            font-family: 'Lato', Helvetica, Arial, sans-serif;
            margin: 2em;
        }
        .email{
            background-color: #fff;
            color: #34495e;
            font-size: 1.1rem;
        }
        .header{
            background-color: #383837;
            color: #fff;
            padding: 2rem;
            text-align: center;
        }
        .message{
            line-height: 1.5em;
            padding: 2rem;
        }
        .message p{
            line-height: 1.5em;
            margin-bottom: .5rem;
            margin-top: 0;
        }
        .notes{
            padding: 2rem;
        }
        .notes .title{
            font-size: .7rem;
            font-weight: bold;
            margin: 0;
        }
        .notes .content{
            font-size: .6rem;
            line-height: 1.5em;
        }
        .footer{
            background-color: #e1e2cd;
            padding: 2rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <section class="email">
        <div class="header">
            @if (isset($settings->sidebar_logo->url))
                <img src="{{ asset('storage/'.$settings->sidebar_logo->url) }}" alt="{{ $settings->title }}" class="img">
            @else
                <img src="{{ asset('img/logo.png') }}" alt="{{ $settings->title }}" class="img">
            @endif
        </div>

        <div class="message">
            {{ $request->input('message') }}
        </div>
        <!-- /.message -->
        @if($estimate->notes != '')
            <div class="notes">
                <h2 class="title">Notas:</h2>
                <!-- /.title -->
                <div class="content">{{ $estimate->notes }}</div>
                <!-- /.content -->
            </div>
            <!-- /.notes -->
        @endif

        <div class="footer">
            @if(\Auth::user()->picture)
                <img src="{{ asset('storage/'.\Auth::user()->picture->url) }}" alt="" class="img" />
            @endif
        </div>
    </section>
    <!-- /.email -->

    @if ( Config::get('app.debug') )
        <script type="text/javascript">
            document.write('<script src="//artifice.dev:35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
        </script>
    @endif
</body>
</html>
