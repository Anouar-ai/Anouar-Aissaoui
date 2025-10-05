import { PlaceHolderImages } from './placeholder-images';

const getAvatar = (id: string) => {
    const image = PlaceHolderImages.find(p => p.id === id);
    return {
        url: image?.imageUrl || '',
        hint: image?.imageHint || 'person avatar'
    }
}

export const reviews = [
  {
    name: 'Sarah L.',
    avatarUrl: getAvatar('avatar2').url,
    avatarHint: getAvatar('avatar2').hint,
    review: 'The instant access to Elementor Pro was a lifesaver for my project. The whole process was seamless. Digital Product Hub is my new go-to!',
    rating: 5,
  },
  {
    name: 'Mike D.',
    avatarUrl: getAvatar('avatar1').url,
    avatarHint: getAvatar('avatar1').hint,
    review: 'I was hesitant at first, but the licenses are 100% official. I got WP Rocket and my site speed has never been better. Fantastic service.',
    rating: 5,
  },
  {
    name: 'Chen W.',
    avatarUrl: getAvatar('avatar3').url,
    avatarHint: getAvatar('avatar3').hint,
    review: 'As a freelance developer, having a reliable source for premium plugins is essential. The prices are fair and the products are top-notch.',
    rating: 5,
  },
];
