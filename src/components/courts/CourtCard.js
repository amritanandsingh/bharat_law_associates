import React, { useEffect, useState } from 'react';
import { FaLandmark } from 'react-icons/fa';
import { resolveCourtImageUrl } from '../../lib/courts';
import '../documents/DocumentCard.css';

const CourtCard = ({ court, index = 0 }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!court?.imageKey) return undefined;
    resolveCourtImageUrl(court.imageKey).then((url) => {
      if (alive && url) setImageUrl(url);
    });
    return () => {
      alive = false;
    };
  }, [court?.imageKey]);

  if (!court) return null;

  return (
    <article className="document-card" data-reveal style={{ '--i': index % 8 }}>
      <span
        className={`document-thumb ${imageUrl && !imageFailed ? '' : 'document-thumb-empty'}`}
      >
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={court.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <FaLandmark size={30} aria-hidden="true" />
        )}
      </span>
      <div className="document-body">
        <h3>{court.name}</h3>
        <p className="document-desc">{court.address}</p>
      </div>
    </article>
  );
};

export default CourtCard;
