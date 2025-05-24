const Kakaomap = ({ lat, lng, container }) => {
  const appKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  const createMap = () => {

    if (!container) {
      console.warn("🛑 지도 container가 null입니다.");
      return;
    }

    const center = new window.kakao.maps.LatLng(lat, lng);
    const map = new window.kakao.maps.Map(container, {
      center,
      level : 2,
    });
    new window.kakao.maps.Marker({
      map,
      position: center,
    });
  };

  // window.kakao.maps 가 생길 때까지 기다리는 안전 로딩
  const waitForKakaoMaps = () => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(createMap);
    } else {
      setTimeout(waitForKakaoMaps, 100);
    }
  };

  const existingScript = document.querySelector("#kakao-map-script");

  if (!existingScript) {
    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      waitForKakaoMaps();
    };
    document.head.appendChild(script);
  } else {
    waitForKakaoMaps();
  }
};

export default Kakaomap;