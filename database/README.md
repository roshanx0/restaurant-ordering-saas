# Database Setup Guide

## Prerequisites

- A Supabase project created at [supabase.com](https://supabase.com)
- Project URL and Anon Key copied to `src/config/config.ts`

## Setting Up the Database with Real-time Replication

### Step 1: Enable Real-time in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Database** → **Replication**
3. You'll see a list of tables with toggle switches
4. **Important**: By default, real-time is OFF for all tables

### Step 2: Run the Database Schema

1. In your Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content of `database/schema.sql` and paste it
4. Click **Run** or press `Ctrl+Enter`
5. Wait for the success message

### Step 3: Enable Real-time for Tables

After running the schema, you need to enable real-time replication in the Supabase Dashboard:

1. Go to **Database** → **Replication**
2. Enable real-time for these tables (toggle ON):
   - ✅ `registration_requests` - For admin pending requests updates
   - ✅ `restaurants` - For admin restaurant list updates
   - ✅ `menu_items` - **CRITICAL** - For stock availability updates to customers
   - ✅ `orders` - **CRITICAL** - For new order notifications to restaurants
   - ✅ `menu_categories` - For menu organization updates
   - ✅ `notifications` - For push notifications (future)

### Step 4: Verify Real-time is Working

Run this query in SQL Editor to confirm:

```sql
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
```

You should see all the tables listed above.

## Database Schema Overview

### Core Tables

| Table                   | Purpose                              | Real-time?      |
| ----------------------- | ------------------------------------ | --------------- |
| `registration_requests` | Restaurant registration applications | ✅ Yes          |
| `restaurants`           | Restaurant accounts                  | ✅ Yes          |
| `users`                 | Restaurant owners/staff login        | ✅ Yes          |
| `menu_categories`       | Menu organization                    | ✅ Yes          |
| `menu_items`            | Menu items with pricing              | ✅ **Critical** |
| `orders`                | Customer orders                      | ✅ **Critical** |
| `admin_users`           | Platform admins                      | ❌ No           |
| `notifications`         | System notifications                 | ✅ Yes          |

### Real-time Use Cases

#### 1. Menu Availability (Stock Updates)

When a restaurant marks a menu item as unavailable:

```sql
UPDATE menu_items SET is_available = false WHERE id = '...';
```

- All customers viewing the menu instantly see it greyed out
- Prevents orders for out-of-stock items

#### 2. New Order Notifications

When a customer places an order:

```sql
INSERT INTO orders (restaurant_id, items, total, ...) VALUES (...);
```

- Restaurant dashboard instantly shows the new order
- Sound notification plays (if implemented)
- Order count badge updates in real-time

#### 3. Pending Request Alerts

When someone registers a restaurant:

```sql
INSERT INTO registration_requests (restaurant_name, ...) VALUES (...);
```

- Admin dashboard instantly shows new pending request
- Counter badge updates automatically

### Key Features Implemented

✅ **Auto-generated Order Numbers**: Format `YYYYMMDD-XXX`  
✅ **Timestamps**: `updated_at` auto-updates on every change  
✅ **Row Level Security**: Restaurants can only see their own data  
✅ **Indexes**: Optimized queries for performance  
✅ **Replica Identity FULL**: Ensures all column changes are captured

## Testing Real-time

### Test Menu Availability Update

1. Open customer menu page in Browser 1
2. Open restaurant dashboard in Browser 2
3. Toggle menu item availability in Browser 2
4. Watch it instantly update in Browser 1 ✨

### Test Order Notification

1. Open restaurant orders page in Browser 1
2. Create a new order from customer page in Browser 2
3. Watch new order appear instantly in Browser 1 with sound notification ✨

## Default Admin Credentials

```
Email: admin@foodbooking.com
Password: admin123
```

⚠️ **Change this immediately in production!**

## Troubleshooting

### Real-time Not Working?

1. **Check Replication Settings**:

   - Go to Database → Replication
   - Ensure toggles are ON for critical tables

2. **Verify Publication**:

   ```sql
   SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
   ```

3. **Check Browser Console**:

   - Open DevTools → Console
   - Look for Supabase subscription messages
   - Should see "SUBSCRIBED" status

4. **RLS Policies**:
   - Public users need SELECT access for menu_items
   - Restaurant users need access to their own data
   - Check policies: `SELECT * FROM pg_policies;`

### Common Issues

**Issue**: "relation 'registration_requests' does not exist"  
**Solution**: Run the schema.sql in SQL Editor

**Issue**: Real-time not updating  
**Solution**: Enable replication in Database → Replication

**Issue**: Orders not appearing  
**Solution**: Check restaurant_id matches logged-in user's restaurant

## Next Steps

1. ✅ Run `database/schema.sql` in Supabase SQL Editor
2. ✅ Enable real-time replication for tables
3. ✅ Test the application
4. 🔧 Build the restaurant pages (Orders, Menu)
5. 🔧 Build the customer ordering interface
6. 🚀 Deploy to production

## Production Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Review and adjust RLS policies
- [ ] Set up database backups
- [ ] Configure SSL/TLS
- [ ] Add database connection pooling
- [ ] Monitor real-time connection limits
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Set up CDN for images

## Support

For Supabase real-time documentation:
https://supabase.com/docs/guides/realtime

For issues, check:

- Supabase Dashboard → Logs
- Browser DevTools → Console
- Network tab for WebSocket connections
