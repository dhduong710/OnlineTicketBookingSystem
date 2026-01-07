import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MovieManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Movie info
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [duration, setDuration] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  // Scheduling
  const [cities, setCities] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [genres, setGenres] = useState([]);

  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCinemas, setSelectedCinemas] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [showtimeSlots, setShowtimeSlots] = useState([
    { startTime: '', format: '2D' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [citiesRes, genresRes] = await Promise.all([
        fetch('http://localhost:8080/api/admin/cities', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/admin/genres', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (citiesRes.ok) setCities(await citiesRes.json());
      if (genresRes.ok) setGenres(await genresRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleCityChange = async (city) => {
    const newCities = selectedCities.includes(city)
      ? selectedCities.filter(c => c !== city)
      : [...selectedCities, city];
    
    setSelectedCities(newCities);

    // Fetch cinemas for selected cities
    if (newCities.length > 0) {
      const token = localStorage.getItem('token');
      const allCinemas = [];
      
      for (const c of newCities) {
        const res = await fetch(`http://localhost:8080/api/admin/cinemas?city=${c}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          allCinemas.push(...data);
        }
      }
      setCinemas(allCinemas);
    } else {
      setCinemas([]);
      setSelectedCinemas([]);
    }
  };

  const handleCinemaChange = (cinemaId) => {
    setSelectedCinemas(prev =>
      prev.includes(cinemaId)
        ? prev.filter(id => id !== cinemaId)
        : [...prev, cinemaId]
    );
  };

  const handleDateChange = (date) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const addShowtimeSlot = () => {
    setShowtimeSlots([...showtimeSlots, { startTime: '', format: '2D' }]);
  };

  const removeShowtimeSlot = (index) => {
    setShowtimeSlots(showtimeSlots.filter((_, i) => i !== index));
  };

  const updateShowtimeSlot = (index, field, value) => {
    const updated = [...showtimeSlots];
    updated[index][field] = value;
    setShowtimeSlots(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const requestData = {
      title,
      summary,
      duration: parseInt(duration),
      posterUrl,
      trailerUrl,
      releaseDate,
      genreIds: selectedGenres,
      cities: selectedCities,
      cinemaIds: selectedCinemas,
      showDates: selectedDates,
      showtimeSlots: showtimeSlots.filter(slot => slot.startTime)
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/movies/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Tạo phim thất bại');
      }

      const result = await response.json();
      setSuccess(result.message);
      toast.success(result.message);
      
      // Reset form
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate next 14 days
  const getNext14Days = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <div className="movie-management-container">
      {success && (
        <div className="admin-success-message">✅ {success}</div>
      )}
      {error && (
        <div className="admin-error-message">⚠️ {error}</div>
      )}

      <form onSubmit={handleSubmit} className="movie-form">
          {/* Movie Information */}
          <div className="form-section">
            <h2 className="section-title">Thông tin Phim</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Tên phim *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Thời lượng (phút) *</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
              </div>

              <div className="form-group full-width">
                <label>Tóm tắt</label>
                <textarea rows="4" value={summary} onChange={(e) => setSummary(e.target.value)} />
              </div>

              <div className="form-group">
                <label>URL Poster</label>
                <input type="url" value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} />
              </div>

              <div className="form-group">
                <label>URL Trailer</label>
                <input type="url" value={trailerUrl} onChange={(e) => setTrailerUrl(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Ngày phát hành</label>
                <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Thể loại</label>
                <div className="checkbox-grid">
                  {genres.map(genre => (
                    <label key={genre.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGenres([...selectedGenres, genre.id]);
                          } else {
                            setSelectedGenres(selectedGenres.filter(id => id !== genre.id));
                          }
                        }}
                      />
                      {genre.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="form-section">
            <h2 className="section-title">Lịch chiếu</h2>
            
            {/* Cities */}
            <div className="form-group">
              <label>Tỉnh thành *</label>
              <div className="checkbox-grid">
                {cities.map(city => (
                  <label key={city} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedCities.includes(city)}
                      onChange={() => handleCityChange(city)}
                    />
                    {city}
                  </label>
                ))}
              </div>
            </div>

            {/* Cinemas */}
            {cinemas.length > 0 && (
              <div className="form-group">
                <label>Rạp chiếu *</label>
                <div className="checkbox-grid">
                  {cinemas.map(cinema => (
                    <label key={cinema.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedCinemas.includes(cinema.id)}
                        onChange={() => handleCinemaChange(cinema.id)}
                      />
                      {cinema.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="form-group">
              <label>Ngày chiếu *</label>
              <div className="checkbox-grid">
                {getNext14Days().map(date => (
                  <label key={date} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedDates.includes(date)}
                      onChange={() => handleDateChange(date)}
                    />
                    {new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                  </label>
                ))}
              </div>
            </div>

            {/* Showtime Slots */}
            <div className="form-group">
              <label>Khung giờ chiếu *</label>
              {showtimeSlots.map((slot, index) => (
                <div key={index} className="showtime-slot">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateShowtimeSlot(index, 'startTime', e.target.value)}
                    required
                  />
                  <select
                    value={slot.format}
                    onChange={(e) => updateShowtimeSlot(index, 'format', e.target.value)}
                  >
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                  </select>
                  {showtimeSlots.length > 1 && (
                    <button type="button" onClick={() => removeShowtimeSlot(index)} className="btn-remove">
                      Xóa
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addShowtimeSlot} className="btn-add-slot">
                + Thêm khung giờ
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Đang tạo...' : 'Tạo Phim và Lịch chiếu'}
          </button>
        </form>
    </div>
  );
};

export default MovieManagement;