import React from "react";

const icons = {
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 21l-4.35-4.35m2.85-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
    </svg>
  ),
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 11l9-9 9 9M4 21v-7h16v7" />
    </svg>
  ),
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
    </svg>
  ),

  chevronLeft: (
    <svg viewBox='0 0 24 24' fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(6, 2)">
          <path d="M10.5 19L1.5 10L10.5 1" stroke="#1B3B6E" fill="none"/>
        </g>
    </svg>
  ),

  loading: (
    <svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier"> <g id="XMLID_2_">
        <path id="XMLID_4_" d="M97.5,165c0-8.284-6.716-15-15-15h-60c-8.284,0-15,6.716-15,15s6.716,15,15,15h60 C90.784,180,97.5,173.284,97.5,165z"></path> 
        <path id="XMLID_5_" d="M307.5,150h-30c-8.284,0-15,6.716-15,15s6.716,15,15,15h30c8.284,0,15-6.716,15-15S315.784,150,307.5,150z"></path>
        <path id="XMLID_6_" d="M172.5,90c8.284,0,15-6.716,15-15V15c0-8.284-6.716-15-15-15s-15,6.716-15,15v60 C157.5,83.284,164.216,90,172.5,90z"></path>
        <path id="XMLID_7_" d="M172.501,240c-8.284,0-15,6.716-15,15v60c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15v-60 C187.501,246.716,180.785,240,172.501,240z"></path>
        <path id="XMLID_8_" d="M77.04,48.327c-5.856-5.858-15.354-5.857-21.213,0c-5.858,5.858-5.858,15.355,0,21.213l42.427,42.428 c2.929,2.929,6.768,4.394,10.606,4.394c3.838,0,7.678-1.465,10.606-4.393c5.858-5.858,5.858-15.355,0-21.213L77.04,48.327z"></path>
        <path id="XMLID_9_" d="M246.746,218.034c-5.857-5.857-15.355-5.857-21.213,0c-5.858,5.858-5.857,15.355,0,21.213l42.428,42.426 c2.929,2.929,6.768,4.393,10.607,4.393c3.839,0,7.678-1.465,10.606-4.393c5.858-5.858,5.858-15.355,0-21.213L246.746,218.034z"></path>
        <path id="XMLID_10_" d="M98.254,218.034L55.828,260.46c-5.858,5.858-5.858,15.355,0,21.213c2.929,2.929,6.768,4.393,10.607,4.393 c3.839,0,7.678-1.464,10.606-4.393l42.426-42.426c5.858-5.858,5.858-15.355,0-21.213 C113.609,212.176,104.111,212.176,98.254,218.034z"></path>
        </g> </g>
    </svg>
  ),

  cross: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12" stroke="#1B3B6E" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 4L12 12" stroke="#1B3B6E" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
  )
};

const Icons = ({ name, size = 24, color = 'currentColor', className = '', ...props }) => {
  const icon = icons[name];

  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return React.cloneElement(icon, {
    width: size,
    height: size,
    fill: color,
    className,
    viewBox: icon.props.viewBox || '0 0 24 24',
    ...props,
  });
};

  
  export default Icons;