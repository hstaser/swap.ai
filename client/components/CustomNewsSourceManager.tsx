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

// Default free news sources to start with
const DEFAULT_FREE_SOURCES: Omit<NewsSource, 'id' | 'isActive'>[] = [
  {
    name: "Reuters (Free)",
    type: "publication",
    url: "reuters.com",
    category: "News",
    keywords: ["breaking", "global", "markets"],
    importance: "high"
  },
  {
    name: "AP News",
    type: "publication",
    url: "apnews.com",
    category: "News",
    keywords: ["breaking", "global", "politics"],
    importance: "medium"
  },
  {
    name: "Yahoo Finance",
    type: "publication",
    url: "finance.yahoo.com",
    category: "Finance",
    keywords: ["markets", "stocks", "earnings"],
    importance: "medium"
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
  const [showAccountLink, setShowAccountLink] = useState(false);
  const [selectedSourceForLink, setSelectedSourceForLink] = useState<NewsSource | null>(null);
  const [showAddFigure, setShowAddFigure] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);
  const [newFigureName, setNewFigureName] = useState("");
  const [newFigureHandle, setNewFigureHandle] = useState("");
  const [newFigurePlatform, setNewFigurePlatform] = useState<"twitter" | "linkedin" | "reddit" | "news">("twitter");
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFigures = localStorage.getItem('customNewsFigures');
    const savedSources = localStorage.getItem('customNewsSources');
    const savedBlocks = localStorage.getItem('customNewsBlocks');

    if (savedFigures) {
      setFigures(JSON.parse(savedFigures));
    } else {
      // Start with empty figures - user must add manually
      setFigures([]);
    }

    if (savedSources) {
      setSources(JSON.parse(savedSources));
    } else {
      // Initialize with only free sources
      const initialSources = DEFAULT_FREE_SOURCES.map(src => ({
        ...src,
        id: `src_${Date.now()}_${Math.random()}`,
        isActive: true // Auto-activate free sources
      }));
      setSources(initialSources);
    }

    if (savedBlocks) {
      setSourceBlocks(JSON.parse(savedBlocks));
    }

    // Set default tab to figures to skip the intro
    setActiveTab("figures");
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
    const source = sources.find(s => s.id === sourceId);
    if (source && !source.isActive) {
      // Show account linking dialog for premium sources
      setSelectedSourceForLink(source);
      setShowAccountLink(true);
    } else {
      setSources(prev => prev.map(src =>
        src.id === sourceId ? { ...src, isActive: !src.isActive } : src
      ));
    }
  };

  const handleAccountLink = () => {
    if (selectedSourceForLink) {
      // Simulate account linking
      setSources(prev => prev.map(src =>
        src.id === selectedSourceForLink.id ? { ...src, isActive: true } : src
      ));
      setShowAccountLink(false);
      setSelectedSourceForLink(null);
    }
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
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="figures">Public Figures</TabsTrigger>
            <TabsTrigger value="sources">News Sources</TabsTrigger>
          </TabsList>


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
                          {!source.isActive && (
                            <p className="text-xs text-gray-500 mt-1">
                              Click to link account
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={source.isActive ? "default" : "outline"}>
                          {source.isActive ? "Linked" : "Link Account"}
                        </Badge>
                        {source.isActive && (
                          <span className="text-xs text-green-600">✓ Connected</span>
                        )}
                      </div>
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
            {figures.filter(f => f.isActive).length} active figures • {sources.filter(s => s.isActive).length} active sources
          </div>
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>

      {/* Account Linking Modal */}
      {showAccountLink && selectedSourceForLink && (
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Link {selectedSourceForLink.name} Account</DialogTitle>
            <DialogDescription>
              Connect your {selectedSourceForLink.name} account to access their news feed
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{selectedSourceForLink.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedSourceForLink.url}
              </p>
              <p className="text-xs text-gray-500">
                You'll be redirected to {selectedSourceForLink.name} to sign in and authorize access
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAccountLink(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAccountLink}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Link Account
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
