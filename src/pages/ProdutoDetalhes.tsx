import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, ShoppingCart, Calculator } from "lucide-react";

interface ProductSpec {
  size: string;
  diameter_mm: number;
  passage_mm: number;
  weight_kg: number;
  length_mm: number;
  height_mm: number;
  drawing_url: string;
}

interface ProductModel {
  id: string;
  name: string;
  description: string;
  specifications: ProductSpec[];
}

const ProdutoDetalhes = () => {
  const { categoria, produto } = useParams();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Mock data - seria carregado de uma API
  const productData: Record<string, any> = {
    "valvula-esfera": {
      name: "Válvula Esfera",
      category: "Válvulas Industriais",
      image: "/imagens/valvulas-industriais/valvula_esfera.png", // <- aqui
      description: "Válvulas esfera de alta performance para aplicações industriais exigentes. Disponível em configurações bipartidas e tripartidas, com diferentes classes de pressão e materiais.",
      features: [
        "Operação 1/4 de volta",
        "Vedação metal-metal ou soft seat",
        "Baixo torque de operação",
        "Manutenção facilitada",
        "Conformidade com normas API e ASME"
      ],
      applications: [
        "Petróleo e Gás",
        "Refinarias",
        "Petroquímicas",
        "Saneamento",
        "Água Industrial"
      ],
      models: [
                {
                  id: "tripartida-300-pr",
                  name: "Válvula Esfera Tripartida 300# Passagem Reduzida",
                  specifications: [
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr34.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr1.jpg" },
                    { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr114.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr112.jpg" },
                    { size: "2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr2.jpg" },
                    { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr212.jpg" },
                    { size: "3\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr3.jpg" }
                  ]
                },
                {
                  id: "tripartida-300-pp",
                  name: "Válvula Esfera Tripartida 300# Passagem Plena",
                  specifications: [
                    { size: "1/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pp14.jpg" },
                    { size: "3/8\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pp38.jpg" },
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pp12.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pp34.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pp1jpg.jpg" },
                    { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pp114.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pp112.jpg" },
                    { size: "2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pp2.jpg" },
                    { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pp212.jpg" }
                  ]
                },
                {
                  id: "tripartida-500",
                  name: "Válvula Esfera Tripartida 500#",
                  specifications: [
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida50012.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida50034.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida5001.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida500112.jpg" },
                    { size: "2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida5002.jpg" },
                    { size: "3\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartida50012.jpg" }
                  ]
                },
                {
                  id: "tripartida-fl150-pr",
                  name: "Válvula Esfera Tripartida Flangeada 150# Passagem Reduzida",
                  specifications: [
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl150pr12.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl150pr34.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl150pr1.jpg" },
                    { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl150pr114.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl150pr112.jpg" },
                    { size: "2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl150pr2.jpg" }
                  ]
                },
                {
                  id: "tripartida-fl150-pp",
                  name: "Válvula Esfera Tripartida Flangeada 150# Passagem Plena",
                  specifications: [
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl150pp12.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl150pp34.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl150pp1.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl150pp112.jpg" }
                  ]
                },
                {
                  id: "tripartida-fl300",
                  name: "Válvula Esfera Tripartida Flangeada 300#",
                  specifications: [
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl30012.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl30034.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl3001.jpg" },
                    { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl300114.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidafl300112.jpg" }
                  ]
                },
                {
                  id: "tripartida-din40",
                  name: "Válvula Esfera Tripartida DIN PN 40",
                  specifications: [
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidadin4012.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidadin4034.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidadin401.jpg" },
                    { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidadin40114.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/tripartidadin40112.jpg" }
                  ]
                },
                {
                  id: "monobloco",
                  name: "Monobloco",
                  specifications: [
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/monobloco12.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/monobloco34.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/monobloco1.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/monobloco112.jpg" }
                  ]
                },
                {
                  id: "wafer",
                  name: "Wafer",
                  specifications: [
                    { size: "3\"", drawing_url: "/imagens/valvulas-industriais/esfera/wafer3.jpg" }
                  ]
                },
                {
                  id: "bipartida-fl150",
                  name: "Bipartida Flangeada 150#",
                  specifications: [
                    { size: "2\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl1502.jpg" },
                    { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl150212.jpg" },
                    { size: "3\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl1503.jpg" },
                    { size: "4\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl1504.jpg" },
                    { size: "6\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl1506.jpg" },
                    { size: "8\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl1508.jpg" },
                    { size: "10\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl15010.jpg" },
                    { size: "12\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl15012.jpg" }
                  ]
                },
                {
                  id: "bipartida-fl300",
                  name: "Bipartida Flangeada 300#",
                  specifications: [
                    { size: "2\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl3002.jpg" },
                    { size: "3\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl3003.jpg" },
                    { size: "4\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidafl150212.jpg" }
                  ]
                },
                {
                  id: "bipartida-din10",
                  name: "Bipartida DIN PN 10",
                  specifications: [
                    { size: "2\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidadinpn102.jpg" },
                    { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidadinpn10212.jpg" },
                    { size: "3\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidadinpn103.jpg" },
                    { size: "4\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidadinpn104.jpg" },
                    { size: "6\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidadinpn106.jpg" },
                    { size: "8\"", drawing_url: "/imagens/valvulas-industriais/esfera/bipartidadinpn108.jpg" }
                  ]
                },
                {
                  id: "diversora-300-pr",
                  name: "Diversora Tripartida 300# Passagem Reduzida",
                  specifications: [
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pr12.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pr34.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pr1.jpg" },
                    { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pr114.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pr112.jpg" },
                    { size: "2\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pr2.jpg" },
                    { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pr212.jpg" },
                    { size: "3\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pr3.jpg" }
                  ]
                },
                {
                  id: "diversora-300-pp",
                  name: "Diversora Tripartida 300# Passagem Plena",
                  specifications: [
                    { size: "1/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pp14.jpg" },
                    { size: "3/8\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pp38.jpg" },
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pp12.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pp34.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pp1.jpg" },
                    { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pp114.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pp112.jpg" },
                    { size: "2\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pp2.jpg" },
                    { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/dt300pp212.jpg" }
                  ]
                },
                {
                  id: "diversora-fl150-pr",
                  name: "Diversora Flangeada 150# Passagem Reduzida",
                  specifications: [
                    { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/df150pr12.jpg" },
                    { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/df150pr34.jpg" },
                    { size: "1\"", drawing_url: "/imagens/valvulas-industriais/esfera/df150pr1.jpg" },
                    { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/esfera/df150pr114.jpg" },
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/df150pr112.jpg" },
                    { size: "2\"", drawing_url: "/imagens/valvulas-industriais/esfera/df150pr2.jpg" }
                  ]
                },
                {
                  id: "diversora-fl150-pp",
                  name: "Diversora Flangeada 150# Passagem Plena",
                  specifications: [
                    { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/esfera/df150pp112.jpg" }
                  ]
                }
              ]
    },
    "valvula-borboleta": {
      name: "Válvula Borboleta",
      category: "Válvulas Industriais",
      image: "/imagens/valvulas-industriais/valvula_borboleta.png",
      description: "Válvulas borboleta de alta performance para aplicações industriais exigentes. Disponível em configurações wafer, lug e flangeada, com diferentes classes de pressão e materiais.",
      features: [
        "Operação 1/4 de volta",
        "Vedação metal-metal ou elastomérica",
        "Baixo torque de operação",
        "Manutenção facilitada",
        "Conformidade com normas API, ANSI e DIN"
      ],
      applications: [
        "Petróleo e Gás",
        "Refinarias",
        "Petroquímicas",
        "Saneamento",
        "Água Industrial"
      ],
      models: [
        {
          id: "borboleta",
          name: "Borboleta",
          specifications: [
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta2.jpg" },
            { size: "2 1/2\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta3.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta4.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta5.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta6.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta8.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta10.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta12.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta14.jpg" },
            { size: "16\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta16.jpg" },
            { size: "18\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta18.jpg" },
            { size: "20\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta20.jpg" },
            { size: "24\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta24.jpg" },
            { size: "30\"", drawing_url: "/imagens/valvulas-industriais/borboleta/borboleta30.jpg" }
          ]
        },
      ]
    },
    "valvula-gaveta": {
      name: "Válvula Gaveta",
      category: "Válvulas Industriais",
      image: "/imagens/valvulas-industriais/valvula_gaveta.png",
      description: "Válvulas gaveta de alta performance para aplicações industriais exigentes. Disponível em configurações flangeadas e roscadas, com diferentes classes de pressão e materiais.",
      features: [],
      applications: [],
      models: [
        {
          id: "gaveta-ferro-fundido-125-hast-ascendente",
          name: "Válvula Gaveta Ferro Fundido 125# Haste Ascendente",
          specifications: [
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha2.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha3.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha4.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha5.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha6.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha8.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha10.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha12.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha14.jpg" },
            { size: "16\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha16.jpg" },
            { size: "18\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha18.jpg" },
            { size: "20\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha20.jpg" },
            { size: "24\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125ha24.jpg" }
          ]
        },
        {
          id: "gaveta-ferro-fundido-125-hast-fixa",
          name: "Válvula Gaveta Ferro Fundido 125# Hast Fixa",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf2.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf3.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf4.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf5.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf6.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf8.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf10.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf12.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf14.jpg" },
            { size: "16\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaff125hf16.jpg" }
          ]
        },
        {
          id: "gaveta-ferro-fundido-din-pn-1016",
          name: "Válvula Gaveta Ferro Fundido DIN PN 10/16",
          specifications: [
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn10162.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn1016212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn10163.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn10164.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn10165.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn10166.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn10168.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn101610.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn101612.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn101614.jpg" },
            { size: "16\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaffdinpn101616.jpg" }
          ]
        },
        {
          id: "gaveta-aco-carbono-150",
          name: "Válvula Gaveta Aço Carbono Fundido 150#",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf150112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf1502.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf150212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf1503.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf1504.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf1505.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf1506.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf1508.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15010.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15012.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15014.jpg" },
            { size: "16\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15016.jpg" },
            { size: "18\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15018.jpg" },
            { size: "20\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15020.jpg" },
            { size: "24\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15024.jpg" }
          ]
        },
        {
          id: "gaveta-aco-carbono-300",
          name: "Válvula Gaveta Aço Carbono Fundido 300#",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf300112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf3002.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf300212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf3003.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf3004.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf3005.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf3006.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf3008.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf30010.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf30012.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf30014.jpg" },
            { size: "16\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf30016.jpg" },
            { size: "18\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf30018.jpg" }
          ]
        },
        {
          id: "gaveta-aco-carbono-600",
          name: "Válvula Gaveta Aço Carbono Fundido 600#",
          specifications: [
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf6002.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf600212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf6003.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf6004.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf6006.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf6008.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf60010.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf60012.jpg" }
          ]
        },
        {
          id: "gaveta-aco-carbono-900",
          name: "Válvula Gaveta Aço Carbono Fundido 900#",
          specifications: [
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf9002.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf900212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf9003.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf9004.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf9006.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf9008.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf90010.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf90012.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf90014.jpg" },
            { size: "16\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf90016.jpg" },
            { size: "18\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf90018.jpg" },
            { size: "20\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf90020.jpg" },
            { size: "24\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf90024.jpg" }
          ]
        },
        {
          id: "gaveta-aco-carbono-1500",
          name: "Válvula Gaveta Aço Carbono Fundido 1500#",
          specifications: [
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15002.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf1500212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15003.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15004.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf9006.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf15008.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf150010.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf150012.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf150014.jpg" },
            { size: "16\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf150016.jpg" },
            { size: "18\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf150018.jpg" },
            { size: "20\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf150020.jpg" },
            { size: "24\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacf150024.jpg" }
          ]
        },
        {
          id: "gaveta-aco-carbono-forjado-800",
          name: "Válvula Gaveta Aço Carbono Forjado 800#",
          specifications: [
            { size: "1/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj800014.jpg" },
            { size: "3/8\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj800038.jpg" },
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj800012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj800034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj8001.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj800114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj800112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj8002.jpg" }
          ]
        },
        {
          id: "gaveta-aco-carbono-forjado-1500",
          name: "Válvula Gaveta Aço Carbono Forjado 1500#",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj1500012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj1500034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj15001.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj1500114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaacforj1500112.jpg" }
          ]
        },
        {
          id: "gaveta-flanges-adaptados-150",
          name: "Válvula Gaveta Flanges Adaptados 150#",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan150012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan150034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan1501.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan150114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan150112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan1502.jpg" }
          ]
        },
        {
          id: "gaveta-flanges-adaptados-300",
          name: "Válvula Gaveta Flanges Adaptados 300#",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan300012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan300034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan3001.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan300114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan300112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan3002.jpg" }
          ]
        },
        {
          id: "gaveta-flanges-adaptados-600",
          name: "Válvula Gaveta Flanges Adaptados 600#",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan600012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan600034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan6001.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan600114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan600112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/gaveta/gavetaflan6002.jpg" }
          ]
        }
      ]
    },
    "valvula-globo": {
      name: "Válvula Globo",
      category: "Válvulas Industriais",
      image: "/imagens/valvulas-industriais/valvula_globo.png",
      description: "Válvulas globo de alta performance para aplicações industriais exigentes. Disponível em diferentes classes de pressão e materiais, com operação eficiente e confiável.",
      features: [
        "Operação linear para controle de fluxo",
        "Vedação metal-metal ou elastomérica",
        "Baixo torque de operação",
        "Manutenção facilitada",
        "Conformidade com normas API, ANSI e DIN"
      ],
      applications: [
        "Petróleo e Gás",
        "Refinarias",
        "Petroquímicas",
        "Saneamento",
        "Água Industrial"
      ],
      models: [
        {
          id: "globo-ferro-fundido-125",
          name: "Válvula Globo Ferro Fundido 125#",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff1252.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff1253.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff1254.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff1255.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff1256.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff1258.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff12510.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff12512.jpg" }
          ]
        },
        {
          id: "globo-ferro-fundido-125-angular",
          name: "Válvula Globo Ferro Fundido 125# Angular",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125ang112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125ang2.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125ang212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125ang3.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125ang4.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125ang5.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125ang6.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125ang8.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125ang10.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/globo/globoff125ang12.jpg" }
          ]
        },
        {
          id: "globo-aco-carbono-fundido-150",
          name: "Válvula Globo Aço Carbono Fundido 150#",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund150112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund1502.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund150212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund1503.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund1504.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund1505.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund1506.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund1508.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund15010.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund15012.jpg" }
          ]
        },
        {
          id: "globo-aco-carbono-fundido-300",
          name: "Válvula Globo Aço Carbono Fundido 300#",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund300112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund3002.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund300212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund3003.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund3004.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund3005.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund3006.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund3008.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund30010.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/globo/globofund30012.jpg" }
          ]
        },
        {
          id: "globo-aco-carbono-fundido-600",
          name: "Válvula Globo Aço Carbono Fundido 600#",
          specifications: [
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacf6002.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacf600212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacf6003.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacf6004.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacf6006.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacf6008.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacf60010.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacf60012.jpg" }
          ]
        },
        {
          id: "globo-aco-carbono-forjado-800",
          name: "Válvula Globo Aço Carbono Forjado 800#",
          specifications: [
            { size: "1/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj80014.jpg" },
            { size: "3/8\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj80038.jpg" },
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj80012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj80034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj8001.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj800114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj800112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj8002.jpg" }
          ]
        },
        {
          id: "globo-aco-carbono-forjado-1500",
          name: "Válvula Globo Aço Carbono Forjado 1500#",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj150012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj150034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj15001.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj1500114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globoacforj1500112.jpg" }
          ]
        },
        {
          id: "globo-flanges-adaptados-150",
          name: "Válvula Globo Flanges Adaptados 150#",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa15012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa15034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa1501.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa150114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa150112.jpg" }
          ]
        },
        {
          id: "globo-flanges-adaptados-300",
          name: "Válvula Globo Flanges Adaptados 300#",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa30012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa30034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa3001.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa300114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa300112.jpg" }
          ]
        },
        {
          id: "globo-flanges-adaptados-600",
          name: "Válvula Globo Flanges Adaptados 600#",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa60012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa60034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa6001.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa600114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/globo/globofa600112.jpg" }
          ]
        }
      ]
    },
    "valvula-agulha": {
      name: "Válvula Agulha", 
      category: "Válvulas Industriais",
      image: "/imagens/valvulas-industriais/valvula_agulha.png",
      description: "Válvulas agulha de alta performance para aplicações industriais exigentes. Disponível em diferentes classes de pressão e materiais, com operação eficiente e confiável.",
      features: [
        "Operação linear para controle de fluxo",
        "Vedação metal-metal ou elastomérica",
        "Baixo torque de operação",
        "Manutenção facilitada",
        "Conformidade com normas API, ANSI e DIN"
      ],
      applications: [
        "Petróleo e Gás",
        "Refinarias",
        "Petroquímicas",
        "Saneamento",
        "Água Industrial"
      ],
      models: [
        {
          id: "agulha-300",
          name: "Válvula Agulha 300#",
          specifications: [
            { size: "1/4\"", drawing_url: "/imagens/valvulas-industriais/agulha/agulha30014.jpg" },
            { size: "3/8\"", drawing_url: "/imagens/valvulas-industriais/agulha/agulha30038.jpg" },
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/agulha/agulha30012.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/agulha/agulha30034.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/agulha/agulha3001.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/agulha/agulha300114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/agulha/agulha300112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/agulha/agulha3002.jpg" }
          ]
        }
      ]
    },
    "valvula-retencao": {
      name: "Válvula Retenção",
      category: "Válvulas Industriais",
      image: "/imagens/valvulas-industriais/valvula_retencao.png",
      description: "Válvulas de retenção de alta performance para aplicações industriais exigentes. Disponível em diferentes classes de pressão e materiais, com operação eficiente e confiável.",
      features: [
        "Evita refluxo de fluídos",
        "Vedação metal-metal ou elastomérica",
        "Baixo torque de operação",
        "Manutenção facilitada",
        "Conformidade com normas API, ANSI e DIN"
      ],
      applications: [
        "Petróleo e Gás",
        "Refinarias",
        "Petroquímicas",
        "Saneamento",
        "Água Industrial"
      ],
      models: [
        {
          id: "retencao-portinhola-125",
          name: "Válvula Retenção Tipo Portinhola 125#",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp125112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1252.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp125212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1253.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1254.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1255.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1256.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1258.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp12510.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp12512.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp12514.jpg" }
          ]
        },
        {
          id: "retencao-portinhola-150",
          name: "Válvula Retenção Tipo Portinhola 150#",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp150112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1502.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp150212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1503.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1504.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1505.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1506.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp1508.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp15010.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp15012.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp15014.jpg" }
          ]
        },
        {
          id: "retencao-portinhola-300",
          name: "Válvula Retenção Tipo Portinhola 300#",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp300112.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp3002.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp300212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp3003.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp3004.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp3006.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp3008.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp30010.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp30012.jpg" }
          ]
        },
        {
          id: "retencao-portinhola-600",
          name: "Válvula Retenção Tipo Portinhola 600#",
          specifications: [
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp6002.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp600212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp6003.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp6004.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp6006.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp6008.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotp60010.jpg" }
          ]
        },
        {
          id: "retencao-portinhola-tipowafer-duplaportinhola",
          name: "Válvula Retenção Tipo Wafer - Dupla Portilhola",
          specifications: [
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw2.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw212.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw3.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw4.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw5.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw6.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw8.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw10.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw12.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw14.jpg" },
            { size: "16\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw16.jpg" },
            { size: "18\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw18.jpg" },
            { size: "20\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw20.jpg" },
            { size: "24\"", drawing_url: "/imagens/valvulas-industriais/retencao/retencaotptw24.jpg" }
          ]
        },
        {
          id: "tipodisco-150300-wafer",
          name: "Válvula Retenção Tipo Disco 150/300# - Wafer",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w04.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w05.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w06.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w07.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w08.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w09.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w10.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w11.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w12.jpg" },
            {size: "125", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w125.jpg" },
            { size: "150", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w150.jpg" },
            { size: "200", drawing_url: "/imagens/valvulas-industriais/retencao/td150300w200.jpg" }
          ]
        },
        {
          id: "tipodisco-150300-uniao",
          name: "Válvula Retenção Tipo Disco 150/300# - União",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300u04.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300u05.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300u06.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300u07.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300u08.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/retencao/td150300u09.jpg" }
          ]
        },
        {
          id: "tipofundpooco125",
          name: "Válvula Retenção Tipo Fundo de Poço 125#",
          specifications: [
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12508.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12509.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12510.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12511.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12513.jpg" },
            { size: "5\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12514.jpg" },
            { size: "6\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12515.jpg" },
            { size: "8\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12516.jpg" },
            { size: "10\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12517.jpg" },
            { size: "12\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12518.jpg" },
            { size: "14\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12519jpg" },
            { size: "16\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12520.jpg" },
            { size: "18\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfp12521.jpg" }
          ]
        },
        {
          id: "tipofundopocodinpn10",
          name: "Válvula Retenção Tipo Fundo de Poço DIN PN 10",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin1004.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin1005.jpg" },
            { size: "1\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin1006.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin1007.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin1008.jpg" },
            { size: "2\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin1009.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin1010.jpg" },
            { size: "3\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin1011.jpg" },
            { size: "4\"", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin1013.jpg" },
            { size: "125", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin10125.jpg" },
            { size: "150", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin10150.jpg" },
            { size: "200", drawing_url: "/imagens/valvulas-industriais/retencao/tfpdin10200.jpg" }
          ]
        },
        {
          id: "tipopistao-carbonofundido-150",
          name: "Válvula Retenção Tipo Pistão Aço Carbono Fundido 150#",
          
        }
      ]
    },
    "flange-com-pescoco": {
      name: "Flange com Pescoço",
      category: "Flanges",
      image: "/imagens/flanges/flange_pescoco.png",
      description: "Flanges com pescoço de alta qualidade para aplicações industriais. Disponível em diferentes classes de pressão e materiais, garantindo vedação perfeita e durabilidade.",
      features: [
        "Material de alta qualidade",
        "Conformidade com normas ASME e DIN",
        "Vedação perfeita",
        "Resistente à corrosão",
        "Facilidade de instalação"
      ],
      applications: [
        "Petróleo e Gás",
        "Refinarias", 
        "Petroquímicas",
        "Saneamento",
        "Água Industrial"
      ],
      models: [
        {
          id: "flange-pescoco-150",
          name: "Flange com Pescoço – 150 Libras",
          description: "Flange com pescoço padrão ASME 150 libras para aplicações de baixa pressão",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/flanges/pescoco/150lb_12.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/flanges/pescoco/150lb_34.jpg" },
            { size: "1\"", drawing_url: "/imagens/flanges/pescoco/150lb_1.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/flanges/pescoco/150lb_114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/flanges/pescoco/150lb_112.jpg" },
            { size: "2\"", drawing_url: "/imagens/flanges/pescoco/150lb_2.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/flanges/pescoco/150lb_212.jpg" },
            { size: "3\"", drawing_url: "/imagens/flanges/pescoco/150lb_3.jpg" },
            { size: "3.1/2\"", drawing_url: "/imagens/flanges/pescoco/150lb_312.jpg" },
            { size: "4\"", drawing_url: "/imagens/flanges/pescoco/150lb_4.jpg" },
            { size: "5\"", drawing_url: "/imagens/flanges/pescoco/150lb_5.jpg" },
            { size: "6\"", drawing_url: "/imagens/flanges/pescoco/150lb_6.jpg" },
            { size: "8\"", drawing_url: "/imagens/flanges/pescoco/150lb_8.jpg" },
            { size: "10\"", drawing_url: "/imagens/flanges/pescoco/150lb_10.jpg" },
            { size: "12\"", drawing_url: "/imagens/flanges/pescoco/150lb_12_grande.jpg" },
            { size: "14\"", drawing_url: "/imagens/flanges/pescoco/150lb_14.jpg" },
            { size: "16\"", drawing_url: "/imagens/flanges/pescoco/150lb_16.jpg" },
            { size: "18\"", drawing_url: "/imagens/flanges/pescoco/150lb_18.jpg" },
            { size: "20\"", drawing_url: "/imagens/flanges/pescoco/150lb_20.jpg" },
            { size: "24\"", drawing_url: "/imagens/flanges/pescoco/150lb_24.jpg" }
          ]
        },
        {
          id: "flange-pescoco-300",
          name: "Flange com Pescoço – 300 Libras",
          description: "Flange com pescoço padrão ASME 300 libras para aplicações de média pressão",
          specifications: [
            { size: "1/2\"", drawing_url: "/imagens/flanges/pescoco/300lb_12.jpg" },
            { size: "3/4\"", drawing_url: "/imagens/flanges/pescoco/300lb_34.jpg" },
            { size: "1\"", drawing_url: "/imagens/flanges/pescoco/300lb_1.jpg" },
            { size: "1.1/4\"", drawing_url: "/imagens/flanges/pescoco/300lb_114.jpg" },
            { size: "1.1/2\"", drawing_url: "/imagens/flanges/pescoco/300lb_112.jpg" },
            { size: "2\"", drawing_url: "/imagens/flanges/pescoco/300lb_2.jpg" },
            { size: "2.1/2\"", drawing_url: "/imagens/flanges/pescoco/300lb_212.jpg" },
            { size: "3\"", drawing_url: "/imagens/flanges/pescoco/300lb_3.jpg" },
            { size: "3.1/2\"", drawing_url: "/imagens/flanges/pescoco/300lb_312.jpg" },
            { size: "4\"", drawing_url: "/imagens/flanges/pescoco/300lb_4.jpg" },
            { size: "5\"", drawing_url: "/imagens/flanges/pescoco/300lb_5.jpg" },
            { size: "6\"", drawing_url: "/imagens/flanges/pescoco/300lb_6.jpg" },
            { size: "8\"", drawing_url: "/imagens/flanges/pescoco/300lb_8.jpg" },
            { size: "10\"", drawing_url: "/imagens/flanges/pescoco/300lb_10.jpg" },
            { size: "12\"", drawing_url: "/imagens/flanges/pescoco/300lb_12_grande.jpg" },
            { size: "14\"", drawing_url: "/imagens/flanges/pescoco/300lb_14.jpg" },
            { size: "16\"", drawing_url: "/imagens/flanges/pescoco/300lb_16.jpg" },
            { size: "18\"", drawing_url: "/imagens/flanges/pescoco/300lb_18.jpg" },
            { size: "20\"", drawing_url: "/imagens/flanges/pescoco/300lb_20.jpg" },
            { size: "24\"", drawing_url: "/imagens/flanges/pescoco/300lb_24.jpg" }
          ]
        }
      ]
    }
  };

  const currentProduct = productData[produto || ""] || {
    name: "Produto não encontrado",
    models: []
  };

  const selectedModelData = currentProduct.models?.find((m: ProductModel) => m.id === selectedModel);
  const selectedSpec = selectedModelData?.specifications.find((s: ProductSpec) => s.size === selectedSize);

  const handleAddToQuote = () => {
    // Aqui seria implementada a funcionalidade de adicionar ao orçamento
    console.log("Adicionado ao orçamento:", {
      product: currentProduct.name,
      model: selectedModelData?.name,
      size: selectedSize,
      spec: selectedSpec
    });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/produtos/${categoria}`)}
            className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para {categoria?.replace('-', ' ')}
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {currentProduct.name}
              </h1>
              <p className="text-primary-foreground/80">
                {currentProduct.category}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Product Info */}
            <div className="space-y-6">
              {/* Product Images */}
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src={currentProduct.image} // imagem da subcategoria
                      alt={currentProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>                 
                </CardContent>
              </Card>

              {/* Product Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {currentProduct.description}
                  </p>
                  
                  {currentProduct.features && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Características:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {currentProduct.features.map((feature: string, index: number) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Applications */}
              {currentProduct.applications && (
                <Card>
                  <CardHeader>
                    <CardTitle>Aplicações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {currentProduct.applications.map((app: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Specifications */}
            <div className="space-y-6">
              {/* Model Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Especificações Técnicas</CardTitle>
                  <CardDescription>
                    Selecione o modelo e tamanho para ver as especificações detalhadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Model Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Modelo:</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentProduct.models?.map((model: ProductModel) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size Selector */}
                  {selectedModelData && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tamanho:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedModelData.specifications.map((spec: ProductSpec) => (
                          <Button
                            key={spec.size}
                            variant={selectedSize === spec.size ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSize(spec.size)}
                            className="text-xs"
                          >
                            {spec.size}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technical Drawing and Specs */}
              {selectedSpec && (
                <Card>
                  <CardHeader className="flex justify-center items-center">
                    <CardTitle className="text-center">
                      {selectedSpec.size}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={selectedSpec.drawing_url} // caminho correto da imagem
                        alt={selectedSpec.size}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Desenho (PDF)
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Add to Quote */}
              {selectedSpec && (
                <Card>
                  <CardContent className="p-6">
                    <Button 
                      onClick={handleAddToQuote}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Adicionar ao Orçamento
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProdutoDetalhes;