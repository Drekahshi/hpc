import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function TerraFarmsPage() {
  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Terra Farms"
        description="Replanting Food Sovereignty Through Decentralization"
      />

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Abstract</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              Terra Farm is a decentralized farming agency developed by Bankai Labs within the Hisa Ecosystem, created to tackle the deeply rooted issues of food insecurity, rural poverty, food supply chain tracking, and disconnected food systems. Born from the belief that food is not just a need but a right, Tera Farm bridges smallholder farmers to a digitized economy—one that is fair, transparent, and rooted in community.
            </p>
            <p>
              We believe that with today's technological advancements, every person should access healthy, natural food. Our goal is to make this accessible, locally grown, and fairly priced food a daily reality. And at the heart of this transformation are the Terraform Units—living nodes in a decentralized network of farms powered by Hedera Hashgraph.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">What is a Terraform Unit?</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p>A <strong>Terraform</strong> is a GPS-mapped, tokenized farm that operates as both an agricultural producer and conservation node:</p>
            <ul>
              <li><strong>Digital Identity:</strong> Registered on-chain with precise boundaries</li>
              <li><strong>Dual Tokens:</strong> $CROP_TOK (harvests) + JANI_TOK (conservation)</li>
              <li><strong>Access:</strong> USSD, mobile app, web—no blockchain expertise needed</li>
              <li><strong>Conservation:</strong> Automatic participation in JANI environmental programs</li>
            </ul>
            <p className="italic">Example: A Kilifi mango farmer tokenizes harvest as $MANGO_TOK while earning JANI_TOK for community borehole maintenance.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Hedera Infrastructure</CardTitle>
            <CardDescription>Shared foundation with JANI for maximum efficiency.</CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Farm Use</TableHead>
                        <TableHead>JANI Integration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell><strong>HTS</strong></TableCell>
                        <TableCell>Tokenize crops/water</TableCell>
                        <TableCell>Mint conservation rewards</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell><strong>Smart Contracts</strong></TableCell>
                        <TableCell>Auto-payments</TableCell>
                        <TableCell>Trigger sustainability bonuses</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell><strong>HCS</strong></TableCell>
                        <TableCell>Supply chain logs</TableCell>
                        <TableCell>Track carbon/tree impact</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell><strong>HBAR</strong></TableCell>
                        <TableCell>Instant settlements</TableCell>
                        <TableCell>Fund infrastructure bonds</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Farmer Journey</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none space-y-4">
                <section>
                    <h3 className="text-xl font-semibold">Onboarding</h3>
                    <ol>
                        <li><strong>GPS Verification:</strong> JANI validators confirm boundaries</li>
                        <li><strong>Conservation Pledge:</strong> Commit to agroforestry, water stewardship, organic practices</li>
                        <li><strong>AI Assistant:</strong> WhatsApp bots, voice guides in local languages</li>
                    </ol>
                </section>
                <Separator />
                <section>
                    <h3 className="text-xl font-semibold">Marketplace</h3>
                     <ul>
                        <li><strong>QR Traceability:</strong> Scan products to see journey + environmental impact</li>
                        <li><strong>Dynamic Pricing:</strong> Base price + sustainability bonus - carbon debt</li>
                        <li><strong>Carbon Bundles:</strong> Buy crops + verified offsets together</li>
                    </ul>
                </section>
                 <Separator />
                 <section>
                    <h3 className="text-xl font-semibold">Rewards System</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Activity</TableHead>
                                <TableHead>Tera Reward</TableHead>
                                <TableHead>JANI Reward</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Organic certification</TableCell>
                                <TableCell>+15% crop value</TableCell>
                                <TableCell>10 JANI_TOK</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Water conservation</TableCell>
                                <TableCell>Efficiency bonuses</TableCell>
                                <TableCell>2x staking APY</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Tree planting</TableCell>
                                <TableCell>Premium pricing</TableCell>
                                <TableCell>1 JANI_TOK/tree</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Youth training</TableCell>
                                <TableCell>Micro-tokens</TableCell>
                                <TableCell>Governance rights</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </section>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Governance</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none space-y-4">
                 <section>
                    <h3 className="text-xl font-semibold">Farmer Circles (Local DAOs)</h3>
                    <ul>
                        <li>15-20 farms per circle</li>
                        <li>Vote on water fees, crop pricing, conservation projects</li>
                        <li>1 farm = 1 vote</li>
                    </ul>
                 </section>
                 <Separator />
                 <section>
                    <h3 className="text-xl font-semibold">JANI Global DAO</h3>
                    <ul>
                        <li>Manages ecosystem funds</li>
                        <li>Approves major infrastructure (boreholes via Green Bonds)</li>
                        <li>Quadratic voting for major decisions</li>
                    </ul>
                 </section>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
