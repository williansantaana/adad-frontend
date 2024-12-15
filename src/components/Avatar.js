import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

const getInitials = (name) => {
  const namesArray = name.split(' ');
  if (namesArray.length === 1) {
    return namesArray[0].charAt(0).toUpperCase();
  }
  return (
    namesArray[0].charAt(0).toUpperCase() +
    namesArray[namesArray.length - 1].charAt(0).toUpperCase()
  );
};

const Avatar = ({ name, size }) => {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  const styles = {
    width: size,
    height: size,
    backgroundColor: bgColor,
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size / 2.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  };

  return (
    <Badge style={styles} bg='dark'>
      {initials}
    </Badge>
  );
};

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  size: 50,
};

export default Avatar;
