import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Twitter,
  User,
  Building2,
  TrendingUp,
  Plus,
  X,
  Settings,
  Search,
  Star,
  Filter,
  Trash2,
  Edit3,
  Save,
  CheckCircle,
  Globe,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for news sources
export interface PublicFigure {
  id: string;
  name: string;
  platform: "twitter" | "linkedin" | "reddit" | "news";
  handle?: string;
  avatar?: string;
  category: "politics" | "business" | "tech" | "finance" | "celebrity" | "other";
  verified?: boolean;
  followerCount?: string;
  description?: string;
  isActive: boolean;
  keywords?: string[];
  importance: "high" | "medium" | "low";
}

export interface NewsSource {
  id: string;
  name: string;
  type: "publication" | "website" | "blog" | "newsletter";
  url?: string;
  category: string;
  isActive: boolean;
  keywords?: string[];
  importance: "high" | "medium" | "low";
}

export interface SourceBlock {
  id: string;
  name: string;
  description: string;
  color: string;
  figures: string[]; // PublicFigure IDs
  sources: string[]; // NewsSource IDs
  keywords: string[];
  isActive: boolean;
  createdAt: string;
}

// Pre-defined popular figures
const POPULAR_FIGURES: Omit<PublicFigure, 'id' | 'isActive'>[] = [
  {
    name: "Elon Musk",
    platform: "twitter",
    handle: "@elonmusk",
    category: "business",
    verified: true,
    followerCount: "164M",
    description: "CEO of Tesla, SpaceX, and owner of X",
    keywords: ["tesla", "spacex", "ai", "crypto", "mars"],
    importance: "high"
  },
  {
    name: "Donald Trump",
    platform: "twitter",
    handle: "@realdonaldtrump",
    category: "politics",
    verified: true,
    followerCount: "87M",
    description: "45th President of the United States",
    keywords: ["politics", "election", "economy", "trade"],
    importance: "high"
  },
  {
    name: "Warren Buffett",
    platform: "news",
    handle: "berkshirehathaway",
    category: "finance",
    verified: true,
    followerCount: "N/A",
    description: "CEO of Berkshire Hathaway, legendary investor",
    keywords: ["investing", "berkshire", "value", "economy"],
    importance: "high"
  },
  {
    name: "Jerome Powell",
    platform: "news",
    handle: "federalreserve",
    category: "finance",
    verified: true,
    followerCount: "N/A",
    description: "Chair of the Federal Reserve",
    keywords: ["fed", "interest rates", "monetary policy", "economy"],
    importance: "high"
  },
  {
    name: "Cathie Wood",
    platform: "twitter",
    handle: "@cathiedwood",
    category: "finance",
    verified: true,
    followerCount: "1.4M",
    description: "CEO of ARK Invest",
    keywords: ["innovation", "disruptive", "tesla", "ai", "genomics"],
    importance: "medium"
  },
  {
    name: "Tim Cook",
    platform: "twitter",
    handle: "@tim_cook",
    category: "business",
    verified: true,
    followerCount: "15M",
    description: "CEO of Apple",
    keywords: ["apple", "iphone", "privacy", "innovation"],
    importance: "medium"
  }
];

const POPULAR_SOURCES: Omit<NewsSource, 'id' | 'isActive'>[] = [
  {
    name: "Bloomberg",
    type: "publication",
    url: "bloomberg.com",
    category: "Finance",
    keywords: ["markets", "finance", "economy", "business"],
    importance: "high"
  },
  {
    name: "Reuters",
    type: "publication",
    url: "reuters.com",
    category: "News",
    keywords: ["breaking", "global", "markets", "politics"],
    importance: "high"
  },
  {
    name: "TechCrunch",
    type: "publication",
    url: "techcrunch.com",
    category: "Technology",
    keywords: ["startups", "tech", "venture", "innovation"],
    importance: "medium"
  },
  {
    name: "Wall Street Journal",
    type: "publication",
    url: "wsj.com",
    category: "Finance",
    keywords: ["markets", "business", "economy", "finance"],
    importance: "high"
  }
];

interface CustomNewsSourceManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSourcesUpdate?: (blocks: SourceBlock[]) => void;
}

export function CustomNewsSourceManager({ isOpen, onClose, onSourcesUpdate }: CustomNewsSourceManagerProps) {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [sourceBlocks, setSourceBlocks] = useState<SourceBlock[]>([]);
  const [activeTab, setActiveTab] = useState("blocks");

  // Form states
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockDescription, setNewBlockDescription] = useState("");
  const [newBlockColor, setNewBlockColor] = useState("#3b82f6");
  const [selectedFigures, setSelectedFigures] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [blockKeywords, setBlockKeywords] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [editingBlock, setEditingBlock] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFigures = localStorage.getItem('customNewsFigures');
    const savedSources = localStorage.getItem('customNewsSources');
    const savedBlocks = localStorage.getItem('customNewsBlocks');

    if (savedFigures) {
      setFigures(JSON.parse(savedFigures));
    } else {
      // Initialize with popular figures
      const initialFigures = POPULAR_FIGURES.map(fig => ({
        ...fig,
        id: `fig_${Date.now()}_${Math.random()}`,
        isActive: false
      }));
      setFigures(initialFigures);
    }

    if (savedSources) {
      setSources(JSON.parse(savedSources));
    } else {
      // Initialize with popular sources
      const initialSources = POPULAR_SOURCES.map(src => ({
        ...src,
        id: `src_${Date.now()}_${Math.random()}`,
        isActive: false
      }));
      setSources(initialSources);
    }

    if (savedBlocks) {
      setSourceBlocks(JSON.parse(savedBlocks));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('customNewsFigures', JSON.stringify(figures));
  }, [figures]);

  useEffect(() => {
    localStorage.setItem('customNewsSources', JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem('customNewsBlocks', JSON.stringify(sourceBlocks));
    if (onSourcesUpdate) {
      onSourcesUpdate(sourceBlocks);
    }
  }, [sourceBlocks, onSourcesUpdate]);

  const handleCreateBlock = () => {
    if (!newBlockName.trim()) return;

    const newBlock: SourceBlock = {
      id: `block_${Date.now()}`,
      name: newBlockName,
      description: newBlockDescription,
      color: newBlockColor,
      figures: selectedFigures,
      sources: selectedSources,
      keywords: blockKeywords.split(',').map(k => k.trim()).filter(k => k),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setSourceBlocks(prev => [...prev, newBlock]);

    // Reset form
    setNewBlockName("");
    setNewBlockDescription("");
    setSelectedFigures([]);
    setSelectedSources([]);
    setBlockKeywords("");
  };

  const handleDeleteBlock = (blockId: string) => {
    setSourceBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  const toggleFigureActive = (figureId: string) => {
    setFigures(prev => prev.map(fig =>
      fig.id === figureId ? { ...fig, isActive: !fig.isActive } : fig
    ));
  };

  const toggleSourceActive = (sourceId: string) => {
    setSources(prev => prev.map(src =>
      src.id === sourceId ? { ...src, isActive: !src.isActive } : src
    ));
  };

  const toggleBlockActive = (blockId: string) => {
    setSourceBlocks(prev => prev.map(block =>
      block.id === blockId ? { ...block, isActive: !block.isActive } : block
    ));
  };

  const filteredFigures = figures.filter(fig =>
    fig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fig.handle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSources = sources.filter(src =>
    src.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    src.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBlockStats = (block: SourceBlock) => {
    const activeFigures = block.figures.filter(fId =>
      figures.find(f => f.id === fId)?.isActive
    ).length;
    const activeSources = block.sources.filter(sId =>
      sources.find(s => s.id === sId)?.isActive
    ).length;

    return { activeFigures, activeSources, totalItems: activeFigures + activeSources };
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Custom News Sources
          </DialogTitle>
          <DialogDescription>
            Create custom source blocks to control what news feeds into your analysis
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="figures">Public Figures</TabsTrigger>
            <TabsTrigger value="sources">News Sources</TabsTrigger>
          </TabsList>

          {/* Source Blocks Tab */}
          <TabsContent value="blocks" className="space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Create New Block */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Source Block
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Block Name</label>
                    <Input
                      placeholder="e.g., Tech Leaders, Market Movers"
                      value={newBlockName}
                      onChange={(e) => setNewBlockName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={newBlockColor}
                        onChange={(e) => setNewBlockColor(e.target.value)}
                        className="w-10 h-10 rounded border"
                      />
                      <Input
                        value={newBlockColor}
                        onChange={(e) => setNewBlockColor(e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="What kind of news should this block track?"
                    value={newBlockDescription}
                    onChange={(e) => setNewBlockDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Keywords (comma-separated)</label>
                  <Input
                    placeholder="tesla, ai, crypto, earnings"
                    value={blockKeywords}
                    onChange={(e) => setBlockKeywords(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Select Figures</label>
                    <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                      {figures.map(figure => (
                        <label key={figure.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFigures.includes(figure.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFigures(prev => [...prev, figure.id]);
                              } else {
                                setSelectedFigures(prev => prev.filter(id => id !== figure.id));
                              }
                            }}
                          />
                          <span className="text-sm">{figure.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Select Sources</label>
                    <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                      {sources.map(source => (
                        <label key={source.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSources.includes(source.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSources(prev => [...prev, source.id]);
                              } else {
                                setSelectedSources(prev => prev.filter(id => id !== source.id));
                              }
                            }}
                          />
                          <span className="text-sm">{source.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <Button onClick={handleCreateBlock} disabled={!newBlockName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Block
                </Button>
              </CardContent>
            </Card>

            {/* Existing Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sourceBlocks.map(block => {
                const stats = getBlockStats(block);
                return (
                  <Card key={block.id} className={cn(
                    "border-2",
                    block.isActive ? "border-green-200 bg-green-50/30" : "border-gray-200"
                  )}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: block.color }}
                          />
                          <CardTitle className="text-lg">{block.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBlockActive(block.id)}
                            className="h-6 w-6 p-0"
                          >
                            {block.isActive ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlock(block.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{block.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Active Sources:</span>
                          <Badge variant="outline">{stats.totalItems} items</Badge>
                        </div>
                        {block.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {block.keywords.map((keyword, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                #{keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Public Figures Tab */}
          <TabsContent value="figures" className="space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search figures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFigures.map(figure => (
                <Card key={figure.id} className={cn(
                  "cursor-pointer transition-colors",
                  figure.isActive ? "border-green-200 bg-green-50/30" : "hover:border-gray-300"
                )} onClick={() => toggleFigureActive(figure.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                          {figure.platform === "twitter" ? (
                            <Twitter className="h-5 w-5 text-blue-600" />
                          ) : (
                            <User className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{figure.name}</h4>
                            {figure.verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          {figure.handle && (
                            <p className="text-sm text-gray-600">{figure.handle}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">{figure.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={figure.isActive ? "default" : "outline"}>
                          {figure.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {figure.followerCount && (
                          <span className="text-xs text-gray-500">{figure.followerCount}</span>
                        )}
                      </div>
                    </div>

                    {figure.keywords && figure.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {figure.keywords.slice(0, 3).map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {figure.keywords.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{figure.keywords.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* News Sources Tab */}
          <TabsContent value="sources" className="space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSources.map(source => (
                <Card key={source.id} className={cn(
                  "cursor-pointer transition-colors",
                  source.isActive ? "border-green-200 bg-green-50/30" : "hover:border-gray-300"
                )} onClick={() => toggleSourceActive(source.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                          <Globe className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{source.name}</h4>
                          {source.url && (
                            <p className="text-sm text-gray-600">{source.url}</p>
                          )}
                          <Badge variant="outline" className="text-xs mt-1">
                            {source.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant={source.isActive ? "default" : "outline"}>
                        {source.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {source.keywords && source.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {source.keywords.slice(0, 3).map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {source.keywords.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{source.keywords.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {sourceBlocks.filter(b => b.isActive).length} active blocks • {figures.filter(f => f.isActive).length} active figures • {sources.filter(s => s.isActive).length} active sources
          </div>
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
