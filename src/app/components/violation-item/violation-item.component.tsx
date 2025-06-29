"use client";

import type { FC } from 'react';
import { HStack, Icon, Tag, Button } from '@chakra-ui/react';
import { HiExclamation } from "react-icons/hi";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";
import { Tooltip } from '../ui/tooltip';

import './violation-item.component.css';
import { AccessibilityIssue } from '../scan/scan.types';
import { ScanPageContextExporter } from '../scan/scan.context';

type ViolationItemProps = {
  violation: AccessibilityIssue;
  index: number;
};

const colorsImpact: Record<string, string> = {
    'minor': 'grey.500',
    'moderate': 'yellow.500',
    'serious': 'red.500',
    'critical': 'red.700',
};

export const ViolationItem: FC<ViolationItemProps> = ({ violation: v, index: i }) => {
    const { removeEntry } = ScanPageContextExporter();

    return (
        <div className="result" key={v.id + i}>
            <h2>
                <Tooltip content={v.impact} openDelay={0} closeDelay={0}>
                    <Icon color={colorsImpact[v.impact] || ''}><HiExclamation /></Icon>
                </Tooltip> {v.help}
            </h2>
            <div>
                {v.description} {v.helpUrl ? <a href={v.helpUrl} target="_blank" aria-describedby="newTabInformer">Learn more <Icon><HiMiniArrowTopRightOnSquare /></Icon></a> : ''}
            </div>
            <div>
                <h3>Affected elements</h3>
                <ul>
                    {v.nodes.map((node) =>
                        node.target.map((t, key) =>
                            <li key={key}>
                                <span>{t}</span>
                            </li>)
                    )}
                </ul>
            </div>
            <div>
                {v.tags.length ?
                    <HStack>
                        {v.tags.map((tag, k) =>
                            <Tag.Root key={k}>
                                <Tag.Label>{tag}</Tag.Label>
                            </Tag.Root>
                        )}
                    </HStack>
                    : ''
                }
            </div>
            <div className="actions">
                <Button type="button" onClick={() => removeEntry(i)}>Remove</Button>
            </div>
        </div>
    );
};
