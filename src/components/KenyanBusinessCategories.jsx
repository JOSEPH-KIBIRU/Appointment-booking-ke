'use client';

export const BUSINESS_CATEGORIES = [
  { id: 'salon', name: 'Salon & Barber', icon: '💇', color: 'bg-purple-100' },
  { id: 'mechanic', name: 'Mechanic & Garage', icon: '🔧', color: 'bg-blue-100' },
  { id: 'clinic', name: 'Clinic & Medical', icon: '🏥', color: 'bg-red-100' },
  { id: 'tutor', name: 'Tutor & Classes', icon: '📚', color: 'bg-green-100' },
  { id: 'tailor', name: 'Tailor & Fashion', icon: '✂️', color: 'bg-yellow-100' },
  { id: 'cleaning', name: 'Cleaning Services', icon: '🧹', color: 'bg-indigo-100' },
  { id: 'repair', name: 'Electronics Repair', icon: '📱', color: 'bg-orange-100' },
  { id: 'fitness', name: 'Gym & Fitness', icon: '💪', color: 'bg-pink-100' },
  { id: 'beauty', name: 'Beauty & Spa', icon: '💅', color: 'bg-rose-100' },
  { id: 'photography', name: 'Photography', icon: '📸', color: 'bg-cyan-100' },
  { id: 'events', name: 'Event Planning', icon: '🎉', color: 'bg-amber-100' },
  { id: 'other', name: 'Other Services', icon: '🛠️', color: 'bg-gray-100' },
];

export const KENYAN_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Machakos',
  'Uasin Gishu', 'Kajiado', 'Meru', 'Kakamega', 'Kilifi', 'Kericho',
  'Garissa', 'Mandera', 'Turkana', 'Marsabit', 'Samburu', 'Isiolo',
  'Tana River', 'Lamu', 'Kwale', 'Taita Taveta', 'Narok', 'Trans Nzoia',
  'Bungoma', 'Busia', 'Siaya', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira',
  'Nandi', 'Elgeyo Marakwet', 'Baringo', 'Laikipia', 'Nyandarua',
  'Nyeri', 'Kirinyaga', 'Muranga', 'Embu', 'Tharaka Nithi', 'Makueni',
  'Kitui', 'Vihiga', 'West Pokot', 'Wajir', 'Bomet'
]; // ✅ FIXED: Lamu appears only once

export function BusinessCategorySelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {BUSINESS_CATEGORIES.map((category) => (
        <button
          key={category.id} // ✅ Using unique ID as key
          type="button"
          onClick={() => onChange(category.id)}
          className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
            ${selected === category.id 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
            }`}
        >
          <span className="text-3xl">{category.icon}</span>
          <span className="font-medium text-sm text-gray-700">{category.name}</span>
        </button>
      ))}
    </div>
  );
}

export function CountySelector({ selected, onChange }) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
    >
      <option value="">Select County</option>
      {KENYAN_COUNTIES.map((county, index) => (
        <option key={`${county}-${index}`} value={county}> {/* ✅ Unique key using index */}
          {county}
        </option>
      ))}
    </select>
  );
}