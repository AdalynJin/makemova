-- Week 8 Refined "Bring your own work" (Flow B · CH01, 11125:41492) allows PNG or JPG up to 10 MB.
-- Raise the artifacts bucket limit from 5 MB to match. Types stay PNG and JPG only.

update storage.buckets
set file_size_limit = 10485760
where id = 'artifacts';
