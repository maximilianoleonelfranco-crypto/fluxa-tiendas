-- Esquema de Base de Datos para Fluxa Tiendas (Supabase / PostgreSQL)

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Tiendas (Stores)
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    whatsapp_number TEXT NOT NULL,
    logo_url TEXT,
    theme_color TEXT DEFAULT '#00D7C0',
    subscription_status TEXT DEFAULT 'pending' CHECK (subscription_status IN ('pending', 'active')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Productos (Products)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Seguridad por Nivel de Fila (RLS)
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para Tiendas (stores)
-- 1. Cualquiera puede ver tiendas que tengan suscripción activa
CREATE POLICY "Public stores are viewable by everyone" ON public.stores
    FOR SELECT USING (subscription_status = 'active');

-- 2. Los dueños pueden ver su propia tienda sin importar el estado de suscripción
CREATE POLICY "Owners can view own store" ON public.stores
    FOR SELECT USING (auth.uid() = user_id);

-- 3. Los usuarios autenticados pueden crear una tienda
CREATE POLICY "Users can create a store" ON public.stores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Los dueños pueden actualizar su tienda
CREATE POLICY "Owners can update own store" ON public.stores
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas de Seguridad para Productos (products)
-- 1. Cualquiera puede ver productos de tiendas activas
CREATE POLICY "Public products are viewable by everyone" ON public.products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE stores.id = products.store_id
            AND stores.subscription_status = 'active'
        )
    );

-- 2. Los dueños pueden ver y gestionar sus propios productos
CREATE POLICY "Owners can manage own products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE stores.id = products.store_id
            AND stores.user_id = auth.uid()
        )
    );

-- Datos de Prueba Iniciales (Seed - Opcional)
-- INSERT INTO public.stores (name, slug, whatsapp_number, subscription_status) 
-- VALUES ('Panadería San José Demo', 'panaderia-demo', '59894968558', 'active');
