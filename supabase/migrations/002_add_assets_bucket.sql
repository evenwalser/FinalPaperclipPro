-- Create a new bucket for static assets
insert into storage.buckets (id, name)
values ('assets', 'assets');

-- Set public access policy
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'assets' ); 