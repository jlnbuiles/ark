import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHorseHead } from '@fortawesome/free-solid-svg-icons';
import SearchBox from '../../components/SearchBox';
import ListView from '../../components/ListView';
import Button from '../../components/Button';

function HorsesTab({ 
  horses,
  loading,
  searchTerm,
  onSearchChange,
  onCreateClick,
  horseLessonCounts
}) {
  const filteredHorses = horses.filter(horse => 
    horse.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ListView
      icon={<FontAwesomeIcon icon={faHorseHead} style={{ marginRight: '10px' }} />}
      title="Horses"
      searchBar={
        <SearchBox 
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search horses by name..."
        />
      }
      createButton={
        <Button variant="blue" onClick={onCreateClick}>
          + Create
        </Button>
      }
      loading={loading}
      isEmpty={filteredHorses.length === 0}
      emptyMessage="No horses found"
      extraHeader={
        <div className="horses-header">
          <span className="horses-header-label">Condition</span>
        </div>
      }
    >
      {filteredHorses.map(horse => {
        const lessonCount = horseLessonCounts.find(h => h.horseId === horse.id)?.count || 0;
        return (
          <div key={horse.id} className="student-card">
            <div className="student-info">
              <div className="student-avatar">
                {horse.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="student-details">
                <h3 className="student-name">{horse.name}</h3>
                <div className="lessons-info">
                  <span className="lessons-badge">
                    {horse.ridingStyle} · {horse.difficultyLevel}
                  </span>
                  <span className={`lessons-badge ${lessonCount >= 3 ? 'low' : ''}`} style={{ marginLeft: '8px' }}>
                    {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'} today
                  </span>
                </div>
              </div>
            </div>
            <span className={`lessons-badge ${horse.condition.toLowerCase()}`}>
              {horse.condition}
            </span>
          </div>
        );
      })}
    </ListView>
  );
}

export default HorsesTab;
