// import Banner from '../components/Banner/Banner'
import Banner2 from '../components/Banner/Banner2'

function BannerPage() {
  const content = [
    {
      link: 'https://example.com/3',
      alt: 'Third image description',
      imageSrc: 'https://png.pngtree.com/thumb_back/fh260/background/20190823/pngtree-banner-3d-glass-abstract-background-image_303778.jpg',
      order: 3,
    },
    {
      link: 'https://example.com/1',
      alt: 'First image description',
      imageSrc: 'https://static.vecteezy.com/ti/vetor-gratis/p1/5239318-ilustracao-abstrata-fluido-azul-onda-banner-fundo-vetor.jpg',
      order: 1,
    },
    {
      link: 'https://example.com/2',
      alt: 'Second image description',
      imageSrc: 'https://i.pinimg.com/originals/30/4b/0b/304b0ba836f045e4fc04cf8f6391e991.jpg',
      order: 2,
    },
  ]

  return (
    <div>
      {/* <Banner content={content} height={400} backgroundColor="#000" fit="contain" /> */}
      <div style={{marginBottom: '20px'}}></div>
      <Banner2 content={content} height={400} backgroundColor="#000" fit="contain" />
    </div>
  )
}

export default BannerPage
