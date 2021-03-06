@extends('layout.base')

@section('title', 'Reportes')
@section('sectionTitle', 'Reportes')

@section('content')
    <div class="row">
        <div class="col-12">
            {{-- <canvas id="estimates-chart" class="chart" width="400" height="400"></canvas>
            <!-- /#estimates-chart.chart --> --}}
            <section class="box">
                <h2 class="title">Cotizaciones por vendedor <a href="{{ url('reportes/exportEstimatesByUser') }}" class="btn btn-green pr">Exportar a Excel</a></h2>
                <!-- /.title -->
                <table class="table">
                    <thead>
                        <tr>
                            <th>Vendedor</th>
                            <th>Pendientes</th>
                            <th>Aceptadas</th>
                            <th>Rechazadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($users as $user)
                            <tr>
                                <td data-th="Vendedor">{{ $user->name }}</td>
                                <td data-th="Pendientes">{{ $user->estimates()->where('status', 'Pendiente')->count() }}</td>
                                <td data-th="Aceptadas">{{ $user->estimates()->where('status', 'Aceptada')->count() }}</td>
                                <td data-th="Rechazadas">{{ $user->estimates()->where('status', 'Rechazada')->count() }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <!-- /.table -->
            </section>
            <!-- /.box -->
        </div>
        <!-- /.col-12 -->
    </div>
    <!-- /.row -->

    <div class="row">
        <div class="col-12">
            <section class="box">
                <h2 class="title">Productos más cotizados <a href="{{ url('reportes/exportMostEstimatedDetails') }}" class="btn btn-green pr">Exportar a Excel</a></h2>
                <!-- /.title -->
                <table class="table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Foto</th>
                            <th>Descripción</th>
                            <th>Cotizaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($most_estimated_details as $most_estimated_detail)
                            @php
                                $product = $most_estimated_detail->product;
                            @endphp
                            <tr>
                                <td data-th="Código">{{ $product->code }}</td>
                                <td data-th="Foto">
                                    <div class="product-photo">
                                        @if ($product->pictures()->first())
                                            {{ Html::image(asset('storage/'.$product->pictures()->first()->url), $product->title, ['class' => 'img']) }}
                                        @endif
                                    </div>
                                    <!-- /.photo -->
                                </td>
                                <td data-th="Descripción">
                                    <h4 class="product-title">{{ $product->title }}</h4>
                                    <!-- /.product-title -->
                                    @if ($product->brand)
                                        <h5 class="product-brand"><b>Marca:</b> <i>{{ $product->brand->title }}</i></h5>
                                        <!-- /.product-brand -->
                                    @endif
                                    @if ($product->category)
                                        <h5 class="product-category"><b>Categoría:</b> <i>{{ $product->category->title }}</i></h5>
                                        <!-- /.product-category -->
                                    @endif
                                    @if ($product->dimensions)
                                        <h5 class="product-dimensions"><b>Dimensiones:</b> <i>{{ $product->dimensions }}</i></h5>
                                        <!-- /.product-dimensions -->
                                    @endif
                                    <div class="product-description">
                                        {{ $product->description }}
                                    </div>
                                    <!-- /.product-description -->
                                </td>
                                <td data-th="Cotizaciones">{{ $most_estimated_detail->total }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <!-- /.table -->
            </section>
            <!-- /.box -->
        </div>
        <!-- /.col-12 -->
    </div>
    <!-- /.row -->

    <div class="row">
        <div class="col-12">
            <section class="box">
                <h2 class="title">Categorías más cotizadas <a href="{{ url('reportes/exportMostEstimatedCategories') }}" class="btn btn-green pr">Exportar a Excel</a></h2>
                <!-- /.title -->
                <table class="table">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Descripción</th>
                            <th>Cotizaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($most_estimated_categories as $most_estimated_category)
                            @php
                                $category = \App\Category::find($most_estimated_category->category_id);
                            @endphp
                            <tr>
                                <td data-th="Categoría">{{ $category->title }}</td>
                                <td data-th="Descripción">{{ $category->description }}</td>
                                <td data-th="Cotizaciones">{{ $most_estimated_category->total }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <!-- /.table -->
            </section>
            <!-- /.box -->
        </div>
        <!-- /.col-12 -->
    </div>
    <!-- /.row -->
@endsection
