# Supabase Integration Documentation

## Project Overview
**PlayNest** - Turf booking platform successfully integrated with **Supabase** backend.

### Connection Details
- **Project Name**: PlayNext
- **Project URL**: https://iitdrynabhkhcoapcjnx.supabase.co
- **Database**: PostgreSQL with real-time capabilities
- **Authentication**: Supabase Auth with custom user profiles

## Database Schema

### Tables Created
1. **users** (9 columns) - Extended user profiles with roles
2. **turfs** (18 columns) - Venue information with location data
3. **bookings** (16 columns) - Reservation management
4. **reviews** (10 columns) - User feedback system
5. **disputes** (13 columns) - Conflict resolution

### Key Features
- Row Level Security (RLS) policies implemented
- Real-time subscriptions enabled
- Storage bucket for turf photos
- Comprehensive indexing for performance

## Services Integration Status

### ✅ Completed Services

#### 1. API Service (`src/services/api.ts`)
- Supabase client configuration
- Environment variable validation
- Centralized API client export

#### 2. Auth Service (`src/services/auth.ts`)
- User registration with Supabase Auth
- Login/logout functionality
- Session management
- Role-based user profiles (customer/owner/admin)
- Password reset capabilities

#### 3. Turfs Service (`src/services/turfs.ts`)
- Venue listing with filtering
- Location-based search with distance calculation
- Sports and amenity filtering
- Price range filtering
- CRUD operations for turf management

#### 4. Bookings Service (`src/services/bookings.ts`)
- Slot availability checking
- Booking creation with payment integration
- User booking history
- Status management (pending/confirmed/cancelled/completed)
- Review system integration

#### 5. Payments Service (`src/services/payments.ts`)
- Razorpay integration framework
- Payment record tracking
- Refund processing
- Payment history
- Order management

### Key Integration Features

#### Authentication Flow
```typescript
// Login
const { user } = await authService.signIn(email, password);

// Register
const { user } = await authService.signUp({
  email, password, name, phone, role
});

// Session management
const user = await authService.getCurrentUser();
```

#### Booking Flow
```typescript
// Check availability
const slots = await BookingService.getAvailableSlots(turfId, date);

// Create booking
const booking = await BookingService.createBooking({
  turfId, customerId, slotStart, slotEnd, customerDetails, paymentMethod
});

// Process payment
const payment = await paymentService.initiatePayment({
  amount, currency, bookingId, customerEmail, customerPhone
});
```

#### Turf Discovery
```typescript
// Get filtered turfs
const turfs = await TurfService.getTurfs({
  sports: ['cricket'], 
  location: 'Mumbai',
  priceRange: { min: 500, max: 2000 }
});

// Distance-based search
const nearbyTurfs = await TurfService.getTurfsNearLocation(lat, lng, radius);
```

## Environment Configuration

### Required Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://iitdrynabhkhcoapcjnx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Payment Gateway
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here

# Maps Integration
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here
```

## Database Migrations Applied

1. **001_create_users_table** - User profiles with role management
2. **002_create_turfs_table** - Venue information storage
3. **003_create_bookings_table** - Reservation system
4. **004_create_reviews_table** - Feedback mechanism
5. **005_create_disputes_table** - Conflict resolution
6. **006_create_storage_bucket** - Image storage for turfs
7. **007_setup_rls_policies** - Row level security
8. **008_seed_test_data** - Sample data for development

## Security Implementation

### Row Level Security (RLS)
- Users can only access their own data
- Owners can manage their turfs
- Admins have system-wide access
- Public read access for turf discovery

### Authentication Policies
- Email verification required
- Secure password requirements
- Session management
- Role-based authorization

## Real-time Features
- Live booking updates
- Instant availability changes
- Real-time notifications
- Live chat support (future enhancement)

## Performance Optimizations
- Database indexing on frequently queried fields
- Efficient query patterns
- Image optimization through Supabase Storage
- Pagination for large datasets

## Testing Status
- ✅ Database connection verified
- ✅ All services compile successfully
- ✅ Environment configuration complete
- ✅ Build process successful
- 🟡 Frontend component integration pending
- 🟡 End-to-end testing pending

## Next Steps

### Immediate Tasks
1. Update React components to use real API calls
2. Implement error handling and loading states
3. Add real-time subscriptions for booking updates
4. Configure Razorpay with actual credentials

### Future Enhancements
1. Real-time chat system
2. Push notifications
3. Advanced analytics dashboard
4. Mobile app API support

## Development Commands

```bash
# Build project
npm run build

# Start development server
npm run dev

# Run tests (when implemented)
npm run test

# Database operations
# Use Supabase dashboard or SQL commands through MCP
```

## Production Checklist

### Before Going Live
- [ ] Update Razorpay keys with production credentials
- [ ] Configure Mapbox token for maps
- [ ] Set up email service (Resend)
- [ ] Configure custom domain
- [ ] Set up monitoring and analytics
- [ ] Implement proper error logging
- [ ] Add rate limiting
- [ ] Security audit
- [ ] Performance testing
- [ ] Backup strategy

## Support & Maintenance
- Database backups: Automated daily
- Monitoring: Supabase dashboard
- Logs: Available through Supabase
- Alerts: Configure for production

---

**Integration Status**: ✅ Backend Complete | 🟡 Frontend Integration Pending

Last Updated: January 2025