import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { AppHeader } from '@/components/app-header';
import { BadgeDollarSign, LineChart, Users, TrendingUp, Bot, CheckCircle, Target, ShieldCheck, Palette, Music, Mic, Library, LandPlot, Upload, PlusCircle, ShoppingCart, Wallet, Gift, PartyPopper, CandyCane, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { ConservationChart } from '@/components/conservation-chart';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const projections = [
    {
        metric: 'Festive NFTs Minted',
        value: '10,000+',
        timeframe: 'this holiday season',
        icon: Gift
    },
    {
        metric: 'Community Events',
        value: '50+ virtual celebrations',
        timeframe: 'planned for December',
        icon: PartyPopper,
    },
    {
        metric: 'Holiday-themed Collections',
        value: '10 new collections',
        timeframe: 'featuring global traditions',
        icon: CandyCane,
    },
     {
        metric: 'Creator Payouts',
        value: '2.5M CHAT',
        timeframe: 'in seasonal bonuses',
        icon: Target,
    },
];

const heritageAssets = [
  {
    id: 1,
    title: 'Luo Oral Traditions #23',
    collection: 'African Storytellers',
    price: 450,
    imageUrl: 'https://picsum.photos/seed/luo-story/600/400',
    imageHint: 'elder storytelling',
    icon: Mic,
  },
  {
    id: 2,
    title: 'Akan Drumming Rhythm #7',
    collection: 'Rhythms of the Continent',
    price: 800,
    imageUrl: 'https://picsum.photos/seed/akan-drums/600/400',
    imageHint: 'african drums',
    icon: Music,
  },
  {
    id: 3,
    title: 'Maasai Beadwork Pattern #54',
    collection: 'Artisan Crafts Collective',
    price: 1250,
    imageUrl: 'https://picsum.photos/seed/maasai-beads/600/400',
    imageHint: 'beadwork art',
    icon: Palette,
  },
];

const trendingCollections = [
    {
        id: 'collection_1',
        name: 'African Storytellers',
        floorPrice: 400,
        items: 150,
        imageUrl: 'https://picsum.photos/seed/story-collection/600/400',
        imageHint: 'ancient manuscript',
        icon: Library,
    },
    {
        id: 'collection_2',
        name: 'Artisan Crafts Collective',
        floorPrice: 950,
        items: 75,
        imageUrl: 'https://picsum.photos/seed/craft-collection/600/400',
        imageHint: 'pottery african',
        icon: Palette,
    },
    {
        id: 'collection_3',
        name: 'Sacred Lands Archives',
        floorPrice: 2500,
        items: 25,
        imageUrl: 'https://picsum.photos/seed/land-collection/600/400',
        imageHint: 'sacred valley',
        icon: LandPlot,
    }
]

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Culture Hisa Dashboard"
        description="Preserve and trade cultural heritage on the SentX-powered marketplace."
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <ArrowUpCircle />
              Send
            </Button>
            <Button variant="outline">
              <ArrowDownCircle />
              Receive
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Validators
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">369</div>
            <p className="text-xs text-muted-foreground">+89 joined this week</p>
          </CardContent>
        </Card>
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cultural Assets
            </CardTitle>
            <Library className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">12.5K</div>
            <p className="text-xs text-muted-foreground">+156 new this week</p>
          </CardContent>
        </Card>
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">21,450 CHAT</div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Floor Price</CardTitle>
            <BadgeDollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">400 CHAT</div>
            <p className="text-xs text-muted-foreground">For 'African Storytellers'</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Featured Assets</CardTitle>
          <CardDescription>Mint, trade, and collect verified cultural assets as NFTs.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {heritageAssets.map((asset) => (
            <Card key={asset.id} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <div className="aspect-video overflow-hidden relative">
                <Image
                  src={asset.imageUrl}
                  alt={asset.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                  data-ai-hint={asset.imageHint}
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold p-2 rounded-full flex items-center gap-2">
                    <asset.icon className="h-4 w-4" />
                    <span>{asset.collection}</span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-headline">{asset.title}</CardTitle>
                <CardDescription>
                  Price: <span className='font-bold text-primary'>{asset.price} CHAT</span>
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex gap-2">
                <Button variant="outline" className="w-full">View Details</Button>
                <Button className="w-full">Make Offer</Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
      
      <div className="grid gap-6 lg:grid-cols-2">
         <Card>
            <CardHeader>
              <CardTitle className="font-headline">Trending Collections</CardTitle>
              <CardDescription>Discover the most popular cultural asset collections.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {trendingCollections.map((collection) => (
                <div key={collection.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition">
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    width={64}
                    height={64}
                    className="object-cover h-16 w-16 rounded-md"
                    data-ai-hint={collection.imageHint}
                  />
                  <div className='flex-grow'>
                    <p className='font-bold text-base'>{collection.name}</p>
                    <p className='text-sm text-muted-foreground'>
                        Floor: <span className='font-semibold text-primary/90'>{collection.floorPrice} CHAT</span>
                    </p>
                  </div>
                   <div className='text-right'>
                      <p className='font-bold text-base'>{collection.items}</p>
                      <p className='text-sm text-muted-foreground'>Items</p>
                   </div>
                </div>
              ))}
            </CardContent>
          </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Bot />SentX Holiday Oracle</CardTitle>
            <CardDescription>Forecasting festive cultural trends for the upcoming season!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                {projections.map((proj) => (
                    <div key={proj.metric} className="flex items-start gap-4">
                        <proj.icon className="h-8 w-8 text-primary mt-1" />
                        <div>
                            <p className="font-bold text-lg">{proj.value}</p>
                            <p className="text-sm text-muted-foreground">{proj.metric} ({proj.timeframe})</p>
                        </div>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold font-headline tracking-tight text-foreground mb-4">
            Ecosystem Actions
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
            <Link href="/validate">
              <Card className="group flex flex-col items-center justify-center p-6 text-center h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <ShieldCheck className="w-12 h-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                  <CardTitle className="font-headline text-lg">Become a Validator</CardTitle>
                  <CardDescription className="text-sm">Verify cultural assets and earn CHAT tokens.</CardDescription>
              </Card>
            </Link>
             <Link href="/chat">
              <Card className="group flex flex-col items-center justify-center p-6 text-center h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <PlusCircle className="w-12 h-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                  <CardTitle className="font-headline text-lg">Upload an Asset</CardTitle>
                  <CardDescription className="text-sm">Create and register a unique cultural heritage asset.</CardDescription>
              </Card>
            </Link>
            <Link href="/chat">
              <Card className="group flex flex-col items-center justify-center p-6 text-center h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <ShoppingCart className="w-12 h-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                  <CardTitle className="font-headline text-lg">Explore Marketplace</CardTitle>
                  <CardDescription className="text-sm">Trade and collect verified cultural assets.</CardDescription>
              </Card>
            </Link>
        </div>
      </div>
    </div>
  );
}
