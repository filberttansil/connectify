function formatPublished(createdAt) {
  const currentTime = new Date();
  const timeDiff = Math.abs(currentTime - createdAt);

  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (minutesDiff < 60) {
    return `${minutesDiff} minutes ago`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff} hours ago`;
  } else {
    return `${daysDiff} days ago`;
  }
}

module.exports = formatPublished;
